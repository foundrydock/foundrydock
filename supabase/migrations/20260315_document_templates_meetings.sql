-- ============================================================
-- Päivitä hallituksen kokouksen pöytäkirjapohja
-- ============================================================
UPDATE document_templates
SET
  name        = 'Hallituksen kokouksen pöytäkirja',
  description = 'Hallituksen kokouksen pöytäkirja — kaikki pakolliset §:t valmiina',
  sort_order  = 10,
  content     = '{
    "type": "doc",
    "content": [
      {"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Hallituksen kokous — pöytäkirja"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Yhtiö: "},{"type":"text","text":"{{company_name}}"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Päivämäärä: "},{"type":"text","text":"{{date}}"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Paikka: "},{"type":"text","text":" "}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Aika: "},{"type":"text","text":"klo ___ – ___"}]},
      {"type":"horizontalRule"},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 1  Kokouksen avaaminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Hallituksen puheenjohtaja ___ avasi kokouksen klo ___."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 2  Kokouksen laillisuus ja päätösvaltaisuus"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Todettiin, että kokous on laillisesti koolle kutsuttu ja päätösvaltainen."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 3  Kokouksen sihteeri ja pöytäkirjantarkastajat"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Sihteeriksi valittiin ___. Pöytäkirjantarkastajiksi valittiin ___ ja ___."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 4  Läsnäolijat"}]},
      {"type":"bulletList","content":[
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"___, puheenjohtaja"}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"___, jäsen"}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"___, jäsen"}]}]}
      ]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 5  Esityslistan hyväksyminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Kokous hyväksyi esityslistan kokouksen asioiden käsittelyjärjestykseksi."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 6  [Ensimmäinen asia]"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Esitys: "}]},
      {"type":"paragraph","content":[{"type":"text","text":"Päätös: Hallitus päätti yksimielisesti, että ___"}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 7  [Toinen asia]"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Esitys: "}]},
      {"type":"paragraph","content":[{"type":"text","text":"Päätös: "}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 8  Muut asiat"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Ei muita asioita."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 9  Kokouksen päättäminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Puheenjohtaja totesi kokouksen käsitelleen kaikki esityslistan asiat ja päätti kokouksen klo ___."}]},
      {"type":"horizontalRule"},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Allekirjoitukset"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Pöytäkirjan vakuudeksi:"}]},
      {"type":"paragraph","content":[{"type":"text","text":" "}]},
      {"type":"paragraph","content":[{"type":"text","text":"___________________________        ___________________________"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Puheenjohtaja                              Sihteeri"}]}
    ]
  }'::jsonb
WHERE category = 'board_minutes' AND is_global = true;

-- Jos ei löydy (fresh install), lisätään
INSERT INTO document_templates (name, category, description, content, is_global, sort_order)
SELECT
  'Hallituksen kokouksen pöytäkirja',
  'board_minutes',
  'Hallituksen kokouksen pöytäkirja — kaikki pakolliset §:t valmiina',
  '{
    "type": "doc",
    "content": [
      {"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Hallituksen kokous — pöytäkirja"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Yhtiö: "},{"type":"text","text":"{{company_name}}"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Päivämäärä: "},{"type":"text","text":"{{date}}"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Paikka: "},{"type":"text","text":" "}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Aika: "},{"type":"text","text":"klo ___ – ___"}]},
      {"type":"horizontalRule"},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 1  Kokouksen avaaminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Hallituksen puheenjohtaja ___ avasi kokouksen klo ___."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 2  Kokouksen laillisuus ja päätösvaltaisuus"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Todettiin, että kokous on laillisesti koolle kutsuttu ja päätösvaltainen."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 3  Kokouksen sihteeri ja pöytäkirjantarkastajat"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Sihteeriksi valittiin ___. Pöytäkirjantarkastajiksi valittiin ___ ja ___."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 4  Läsnäolijat"}]},
      {"type":"bulletList","content":[
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"___, puheenjohtaja"}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"___, jäsen"}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"___, jäsen"}]}]}
      ]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 5  Esityslistan hyväksyminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Kokous hyväksyi esityslistan kokouksen asioiden käsittelyjärjestykseksi."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 6  [Ensimmäinen asia]"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Esitys: "}]},
      {"type":"paragraph","content":[{"type":"text","text":"Päätös: Hallitus päätti yksimielisesti, että ___"}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 7  [Toinen asia]"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Esitys: "}]},
      {"type":"paragraph","content":[{"type":"text","text":"Päätös: "}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 8  Muut asiat"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Ei muita asioita."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 9  Kokouksen päättäminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Puheenjohtaja totesi kokouksen käsitelleen kaikki esityslistan asiat ja päätti kokouksen klo ___."}]},
      {"type":"horizontalRule"},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Allekirjoitukset"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Pöytäkirjan vakuudeksi:"}]},
      {"type":"paragraph","content":[{"type":"text","text":" "}]},
      {"type":"paragraph","content":[{"type":"text","text":"___________________________        ___________________________"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Puheenjohtaja                              Sihteeri"}]}
    ]
  }'::jsonb,
  true,
  10
WHERE NOT EXISTS (
  SELECT 1 FROM document_templates WHERE category = 'board_minutes' AND is_global = true
);

-- ============================================================
-- Varsinainen yhtiökokous (OYL:n mukaiset pakolliset §:t)
-- ============================================================
INSERT INTO document_templates (name, category, description, content, is_global, sort_order)
VALUES (
  'Varsinainen yhtiökokous — pöytäkirja',
  'board_minutes',
  'Vuosittaisen varsinaisen yhtiökokouksen pöytäkirja OYL:n pakollisilla kohdilla',
  '{
    "type": "doc",
    "content": [
      {"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Varsinainen yhtiökokous — pöytäkirja"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Yhtiö: "},{"type":"text","text":"{{company_name}}"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Y-tunnus: "},{"type":"text","text":" "}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Päivämäärä: "},{"type":"text","text":"{{date}}"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Paikka: "},{"type":"text","text":" "}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Aika: "},{"type":"text","text":"klo ___ – ___"}]},
      {"type":"horizontalRule"},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 1  Kokouksen avaaminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Hallituksen puheenjohtaja ___ avasi kokouksen klo ___."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 2  Kokouksen puheenjohtajan valitseminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Kokouksen puheenjohtajaksi valittiin yksimielisesti ___."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 3  Sihteerinen ja ääntenlaskijoiden valitseminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Sihteeriksi valittiin ___. Ääntenlaskijoiksi valittiin ___ ja ___."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 4  Kokouksen laillisuus ja päätösvaltaisuus"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Todettiin, että kokous on laillisesti koolle kutsuttu ja päätösvaltainen. Kokouskutsu on toimitettu yhtiöjärjestyksessä määrätyllä tavalla ___ päivää ennen kokousta."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 5  Läsnä olevat osakkeenomistajat ja ääniluettelo"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Kokouksessa olivat läsnä tai edustettuina seuraavat osakkeenomistajat:"}]},
      {"type":"bulletList","content":[
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"___, ___ osaketta (___ ääntä)"}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"___, ___ osaketta (___ ääntä)"}]}]}
      ]},
      {"type":"paragraph","content":[{"type":"text","text":"Yhteensä: ___ osaketta, ___ ääntä. Kokouksessa edustettu ___ % kaikista äänistä."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 6  Esityslistan hyväksyminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Kokous hyväksyi kokouskutsussa esitetyn esityslistan kokouksen asioiden käsittelyjärjestykseksi."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 7  Tilinpäätöksen ja toimintakertomuksen esittely"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Esitettiin yhtiön tilinpäätös ja toimintakertomus tilikaudelta ___. Tilintarkastuskertomus oli kokouksen käytettävissä."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 8  Tilinpäätöksen vahvistaminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Päätös: Kokous päätti vahvistaa tilinpäätöksen tilikaudelta ___."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 9  Taseen osoittaman voiton käyttäminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Tilikauden tulos oli ___ euroa. Kokous päätti, että tulos ___:"}]},
      {"type":"bulletList","content":[
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Siirretään voittovaroihin: ___ euroa"}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Jaetaan osinkona: ___ euroa / osake (yhteensä ___ euroa)"}]}]}
      ]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 10  Vastuuvapaus hallituksen jäsenille ja toimitusjohtajalle"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Päätös: Kokous myönsi vastuuvapauden hallituksen jäsenille ja toimitusjohtajalle tilikaudelta ___."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 11  Hallituksen jäsenten palkkioista päättäminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Päätös: Kokous päätti, että hallituksen jäsenille maksetaan palkkiota ___ euroa / kokous."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 12  Hallituksen jäsenten valitseminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Hallitukseen valittiin seuraavat henkilöt toimikaudeksi, joka päättyy seuraavan varsinaisen yhtiökokouksen päättyessä:"}]},
      {"type":"bulletList","content":[
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"___ (uudelleenvalittu / uusi jäsen)"}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"___ (uudelleenvalittu / uusi jäsen)"}]}]}
      ]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 13  Tilintarkastajan palkkiosta päättäminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Päätös: Tilintarkastajan palkkio maksetaan kohtuullisen laskun mukaan."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 14  Tilintarkastajan valitseminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Tilintarkastajaksi valittiin ___ (KHT / HTM). Varatilintarkastajaksi valittiin ___."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 15  Muut asiat"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Ei muita asioita."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 16  Kokouksen päättäminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Puheenjohtaja totesi kokouksen käsitelleen kaikki esityslistan asiat ja päätti kokouksen klo ___."}]},
      {"type":"horizontalRule"},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Allekirjoitukset"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Pöytäkirjan vakuudeksi:"}]},
      {"type":"paragraph","content":[{"type":"text","text":" "}]},
      {"type":"paragraph","content":[{"type":"text","text":"___________________________        ___________________________"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Puheenjohtaja                              Sihteeri"}]},
      {"type":"paragraph","content":[{"type":"text","text":" "}]},
      {"type":"paragraph","content":[{"type":"text","text":"Pöytäkirja tarkastettu:"}]},
      {"type":"paragraph","content":[{"type":"text","text":" "}]},
      {"type":"paragraph","content":[{"type":"text","text":"___________________________        ___________________________"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Pöytäkirjantarkastaja                  Pöytäkirjantarkastaja"}]}
    ]
  }'::jsonb,
  true,
  20
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Ylimääräinen yhtiökokous
-- ============================================================
INSERT INTO document_templates (name, category, description, content, is_global, sort_order)
VALUES (
  'Ylimääräinen yhtiökokous — pöytäkirja',
  'board_minutes',
  'Ylimääräisen yhtiökokouksen pöytäkirja OYL:n mukaisesti',
  '{
    "type": "doc",
    "content": [
      {"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Ylimääräinen yhtiökokous — pöytäkirja"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Yhtiö: "},{"type":"text","text":"{{company_name}}"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Y-tunnus: "},{"type":"text","text":" "}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Päivämäärä: "},{"type":"text","text":"{{date}}"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Paikka: "},{"type":"text","text":" "}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Aika: "},{"type":"text","text":"klo ___ – ___"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Kokouksen tarkoitus: "},{"type":"text","text":" "}]},
      {"type":"horizontalRule"},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 1  Kokouksen avaaminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Hallituksen puheenjohtaja ___ avasi kokouksen klo ___."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 2  Kokouksen puheenjohtajan valitseminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Kokouksen puheenjohtajaksi valittiin yksimielisesti ___."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 3  Sihteerin ja ääntenlaskijoiden valitseminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Sihteeriksi valittiin ___. Ääntenlaskijoiksi valittiin ___ ja ___."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 4  Kokouksen laillisuus ja päätösvaltaisuus"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Todettiin, että kokous on laillisesti koolle kutsuttu ja päätösvaltainen. Kokouskutsu on toimitettu yhtiöjärjestyksessä määrätyllä tavalla ___ päivää ennen kokousta."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 5  Läsnä olevat osakkeenomistajat ja ääniluettelo"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Kokouksessa olivat läsnä tai edustettuina seuraavat osakkeenomistajat:"}]},
      {"type":"bulletList","content":[
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"___, ___ osaketta (___ ääntä)"}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"___, ___ osaketta (___ ääntä)"}]}]}
      ]},
      {"type":"paragraph","content":[{"type":"text","text":"Yhteensä: ___ osaketta, ___ ääntä. Kokouksessa edustettu ___ % kaikista äänistä."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 6  Esityslistan hyväksyminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Kokous hyväksyi kokouskutsussa esitetyn esityslistan kokouksen asioiden käsittelyjärjestykseksi."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 7  [Asia 1 — kokouksen erityinen tarkoitus]"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Esitys: "}]},
      {"type":"paragraph","content":[{"type":"text","text":"Keskustelu: "}]},
      {"type":"paragraph","content":[{"type":"text","text":"Päätös: Kokous päätti yksimielisesti, että ___"}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 8  [Asia 2 — tarvittaessa lisää §:ia]"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Esitys: "}]},
      {"type":"paragraph","content":[{"type":"text","text":"Päätös: "}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 9  Muut asiat"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Ei muita asioita."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"§ 10  Kokouksen päättäminen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Puheenjohtaja totesi kokouksen käsitelleen kaikki esityslistan asiat ja päätti kokouksen klo ___."}]},
      {"type":"horizontalRule"},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Allekirjoitukset"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Pöytäkirjan vakuudeksi:"}]},
      {"type":"paragraph","content":[{"type":"text","text":" "}]},
      {"type":"paragraph","content":[{"type":"text","text":"___________________________        ___________________________"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Puheenjohtaja                              Sihteeri"}]},
      {"type":"paragraph","content":[{"type":"text","text":" "}]},
      {"type":"paragraph","content":[{"type":"text","text":"Pöytäkirja tarkastettu:"}]},
      {"type":"paragraph","content":[{"type":"text","text":" "}]},
      {"type":"paragraph","content":[{"type":"text","text":"___________________________        ___________________________"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Pöytäkirjantarkastaja                  Pöytäkirjantarkastaja"}]}
    ]
  }'::jsonb,
  true,
  30
)
ON CONFLICT DO NOTHING;
