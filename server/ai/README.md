# Partie AI - Analyse de congestion portuaire

Ce dossier contient les scripts pour :
- Lire les fichiers NAVIRES et MARCHANDISE (XLS)
- Calculer la congestion journalière
- Prévoir la congestion future

## Prérequis
- Python 3.8 ou plus
- Installer les dépendances Python :

```powershell
pip install pandas numpy scikit-learn openpyxl
```

## Utilisation en ligne de commande
1. Placez vos fichiers `NAVIRES_tg_2024.xlsx` et `marchandise_TG_2024.xlsx` dans le dossier `server/data`.
2. Exécutez le script pour obtenir la congestion et la prévision :

```powershell
python analyse_congestion.py --start-date AAAA-MM-JJ --days N
```
- `--start-date` (optionnel) : date de début de la prévision (ex : 2025-05-09)
- `--days` (optionnel) : nombre de jours à prédire (défaut : 7)

## Utilisation via l'API (backend Node.js)
- Le backend expose une route POST :
  - `POST /api/congestion/predict`
  - Body JSON : `{ "startDate": "AAAA-MM-JJ", "days": N }`
  - Réponse : liste des prévisions de congestion

## Formule utilisée
```
congestion = (nombre de navires présents × volume de marchandises manipulé) / capacité du port
```
- La capacité du port (`CAPACITE_PORT`) est définie dans le script (par défaut : 10 000 colis/jour).

---

Pour toute erreur d'encodage ou de dépendance, vérifiez que vous utilisez bien Python 3 et que tous les packages sont installés.
