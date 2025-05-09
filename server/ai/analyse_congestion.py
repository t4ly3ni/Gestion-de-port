import pandas as pd
import numpy as np
from datetime import timedelta
from sklearn.linear_model import LinearRegression
import os
import sys
from datetime import datetime

# Chemins des fichiers de données
DATA_DIR = os.path.join(os.path.dirname(__file__), '../data')
NAVIRE_FILE = os.path.join(DATA_DIR, 'NAVIRES_tg_2024.xlsx')
MARCHANDISE_FILE = os.path.join(DATA_DIR, 'marchandise_TG_2024.xlsx')

# Paramètre à ajuster selon la capacité réelle du port
CAPACITE_PORT = 10000  # Ex: 10 000 tonnes/jour (à adapter)

def lire_navires():
    df = pd.read_excel(NAVIRE_FILE, sheet_name=0)
    # Adapter les noms de colonnes selon le fichier réel
    df['DATE_ARRIVEE'] = pd.to_datetime(df['DATE_ARRIVEE'], format='%d/%m/%y %H.%M')
    df['ETD'] = pd.to_datetime(df['ETD'], format='%d/%m/%y %H.%M')
    return df

def lire_marchandises():
    df = pd.read_excel(MARCHANDISE_FILE, sheet_name=0)
    # Adapter les noms de colonnes selon le fichier réel
    df['DATE_MAN'] = pd.to_datetime(df['DATE_MAN'], format='%d-%m-%y')
    return df

def calculer_congestion_journaliere():
    navires = lire_navires()
    marchandises = lire_marchandises()
    # Générer la liste de tous les jours couverts
    min_date = navires['DATE_ARRIVEE'].min().normalize()
    max_date = navires['ETD'].max().normalize()
    jours = pd.date_range(min_date, max_date)
    # Calcul du nombre de navires présents par jour
    navires_par_jour = pd.Series(0, index=jours)
    for _, row in navires.iterrows():
        jours_presence = pd.date_range(row['DATE_ARRIVEE'].normalize(), row['ETD'].normalize())
        navires_par_jour.loc[jours_presence] += 1
    # Calcul du volume de marchandises manipulé par jour
    volume_par_jour = marchandises.groupby(marchandises['DATE_MAN'].dt.normalize())['NBR_COLIS'].sum().reindex(jours, fill_value=0)
    # Formule de congestion
    congestion = (navires_par_jour * volume_par_jour) / CAPACITE_PORT
    df_congestion = pd.DataFrame({
        'navires': navires_par_jour,
        'volume': volume_par_jour,
        'congestion': congestion
    })
    return df_congestion

def forecast_congestion(df_congestion, jours_a_predire=7):
    # Modèle simple de régression linéaire sur la congestion
    df = df_congestion.reset_index()
    df = df.rename(columns={'index': 'date'})
    df = df.dropna()
    X = np.arange(len(df)).reshape(-1, 1)
    y = df['congestion'].values
    model = LinearRegression()
    model.fit(X, y)
    X_pred = np.arange(len(df), len(df) + jours_a_predire).reshape(-1, 1)
    y_pred = model.predict(X_pred)
    dates_pred = pd.date_range(df['date'].iloc[-1] + timedelta(days=1), periods=jours_a_predire)
    forecast = pd.DataFrame({'date': dates_pred, 'congestion_predite': y_pred})
    return forecast

def main():
    # Parse arguments for custom start date and days
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--start-date', type=str, default=None)
    parser.add_argument('--days', type=int, default=7)
    args = parser.parse_args()

    df_congestion = calculer_congestion_journaliere()
    print('Congestion journalière:')
    print(df_congestion.tail(10))

    # If a start date is provided, find the index to start prediction from
    if args.start_date:
        try:
            start_date = pd.to_datetime(args.start_date)
            # Find the closest date in the index
            idx = (abs(df_congestion.index - start_date)).argmin()
            df_congestion = df_congestion.iloc[:idx+1]
        except Exception as e:
            print(f"Erreur de parsing de la date: {e}", file=sys.stderr)
            sys.exit(1)
    forecast = forecast_congestion(df_congestion, jours_a_predire=args.days)
    print('\nPrévision de la congestion pour les prochains jours:')
    print(forecast)

if __name__ == "__main__":
    main()
