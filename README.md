# Mushroom Classification (RUAP Projekt)

Web aplikacija za procjenu jestivosti gljive na temelju morfoloških značajki, koristeći model strojnog učenja treniran i deployan u **Azure Machine Learningu**.

## Opis projekta

Korisnik kroz web sučelje odabire karakteristike gljive (dropdown izbornici), a aplikacija šalje podatke na backend (**Node.js/Express**), koji zatim poziva deployani **Azure ML endpoint** i vraća predikciju.

Aplikacija prikazuje osnovne informacije:
- predikciju klase (`e` = jestiva, `p` = otrovna)
- informaciju je li gljiva vjerojatno otrovna
- score / probability vrijednosti modela

## Tehnologije

- **Frontend:** HTML, CSS, JavaScript
- **Backend (proxy):** Node.js + Express
- **ML / API:** Azure Machine Learning (Designer + deployani endpoint)

## Struktura projekta (primjer)

```text
mushroom-web/
├── public/
│   ├── index.html
│   ├── styles.css
│   ├── pages/
│   │   ├── test.html
│   │   ├── edible.html
│   │   └── poisonous.html
│   └── picture/
├── server.js
├── .env
├── package.json
└── node_modules/# Mushroom Classification (RUAP Projekt)

Web aplikacija za procjenu jestivosti gljive na temelju morfoloških značajki, koristeći model strojnog učenja treniran i deployan u **Azure Machine Learningu**.

## Opis projekta

Korisnik kroz web sučelje odabire karakteristike gljive (dropdown izbornici), a aplikacija šalje podatke na backend (**Node.js/Express**), koji zatim poziva deployani **Azure ML endpoint** i vraća predikciju.

Aplikacija prikazuje osnovne informacije:
- predikciju klase (`e` = jestiva, `p` = otrovna)
- informaciju je li gljiva vjerojatno otrovna
- score / probability vrijednosti modela

## Tehnologije

- **Frontend:** HTML, CSS, JavaScript
- **Backend (proxy):** Node.js + Express
- **ML / API:** Azure Machine Learning (Designer + deployani endpoint)

## Struktura projekta (primjer)

```text
mushroom-web/
├── public/
│   ├── index.html
│   ├── styles.css
│   ├── pages/
│   │   ├── test.html
│   │   ├── edible.html
│   │   └── poisonous.html
│   └── picture/
├── server.js
├── .env
├── package.json
└── node_modules/
Pokretanje projekta (lokalno)
1) Instalacija ovisnosti
npm install
2) Kreiranje .env datoteke (u root folderu projekta)
AZUREML_ENDPOINT=http://YOUR-AZURE-ACI-ENDPOINT/score
AZUREML_KEY=YOUR_API_KEY
AZUREML_INPUT_NAME=WebServiceInput0

Napomena: AZUREML_INPUT_NAME mora odgovarati nazivu inputa iz Azure ML Consume taba (npr. WebServiceInput0).

3) Pokretanje servera
node server.js
4) Otvaranje aplikacije u pregledniku
http://localhost:3000/pages/test.html
Kako aplikacija radi

Korisnik na stranici test.html odabere značajke gljive.

Frontend šalje odabrane vrijednosti na lokalni backend (/predict).

Backend formatira payload i poziva Azure ML endpoint.

Azure ML model vraća predikciju.

Rezultat se prikazuje u web sučelju (tablica + vjerojatnost).

Napomene

Backend služi kao proxy između web stranice i Azure ML endpointa kako bi se:

izbjegli CORS problemi

sakrio API ključ (ne izlaže se u browseru)

Projekt je edukativne prirode i ne smije se koristiti za stvarno određivanje jestivosti gljiva u praksi.

Dataset

Projekt koristi dataset:

Mushroom Classification (Kaggle / UCI Mushroom dataset)

Autori

RUAP projektni tim (Adriano Strganac, Ivan Cestar, Matej Andračić)


