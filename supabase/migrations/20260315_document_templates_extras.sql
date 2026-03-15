-- ============================================================
-- Poista mahdolliset duplikaatit board_minutes-pohjista
-- (säilytetään vain uusimmat / sort_order-järjestyksessä)
-- ============================================================
DELETE FROM document_templates
WHERE category = 'board_minutes'
  AND is_global = true
  AND id NOT IN (
    SELECT DISTINCT ON (name) id
    FROM document_templates
    WHERE category = 'board_minutes' AND is_global = true
    ORDER BY name, sort_order ASC NULLS LAST
  );

-- ============================================================
-- Sopimuspohja (contract)
-- ============================================================
INSERT INTO document_templates (name, category, description, content, is_global, sort_order)
VALUES (
  'Sopimuspohja',
  'contract',
  'Yleinen sopimuspohja täytettävillä kentillä',
  '{
    "type": "doc",
    "content": [
      {"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"SOPIMUS"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Sopimusosapuolet"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Tämä sopimus on tehty seuraavien osapuolten välillä:"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Osapuoli 1: "},{"type":"text","text":"{{company_name}}, Y-tunnus: ___"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Osapuoli 2: "},{"type":"text","text":"___, Y-tunnus: ___"}]},
      {"type":"horizontalRule"},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"1. Sopimuksen kohde"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Tämän sopimuksen kohteena on ___."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"2. Sopimuskausi"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Sopimus on voimassa ___. – ___. välisenä aikana."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"3. Hinta ja maksuehdot"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Korvaus sopimuksen kohteesta on ___ euroa (alv 0 %). Lasku maksetaan ___ päivän kuluessa laskun päiväyksestä."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"4. Osapuolten velvollisuudet"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Osapuoli 1 sitoutuu: "}]},
      {"type":"bulletList","content":[
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"___"}]}]}
      ]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Osapuoli 2 sitoutuu: "}]},
      {"type":"bulletList","content":[
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"___"}]}]}
      ]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"5. Salassapito"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Osapuolet sitoutuvat pitämään salassa sopimuksen sisällön ja toistensa liikesalaisuudet."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"6. Sopimuksen irtisanominen"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Sopimus voidaan irtisanoa ___ kuukauden irtisanomisajalla kirjallisesti."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"7. Erimielisyyksien ratkaisu"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Sopimuksesta aiheutuvat erimielisyydet ratkaistaan ensisijaisesti neuvotteluin. Mikäli sopuun ei päästä, asia ratkaistaan Helsingin käräjäoikeudessa."}]},
      {"type":"horizontalRule"},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Allekirjoitukset"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Paikka ja aika: ___, {{date}}"}]},
      {"type":"paragraph","content":[{"type":"text","text":" "}]},
      {"type":"paragraph","content":[{"type":"text","text":"___________________________        ___________________________"}]},
      {"type":"paragraph","content":[{"type":"text","text":"{{company_name}}                            ___"}]}
    ]
  }'::jsonb,
  true,
  40
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- NDA — Salassapitosopimus
-- ============================================================
INSERT INTO document_templates (name, category, description, content, is_global, sort_order)
VALUES (
  'Salassapitosopimus (NDA)',
  'nda',
  'Non-Disclosure Agreement — molemminpuolinen salassapitosopimus',
  '{
    "type": "doc",
    "content": [
      {"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"SALASSAPITOSOPIMUS"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Non-Disclosure Agreement (NDA)"}]},
      {"type":"horizontalRule"},
      {"type":"paragraph","content":[{"type":"text","text":"Tämä salassapitosopimus on solmittu seuraavien osapuolten välillä:"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Osapuoli A: "},{"type":"text","text":"{{company_name}}, Y-tunnus: ___, osoite: ___"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Osapuoli B: "},{"type":"text","text":"___, Y-tunnus: ___, osoite: ___"}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"1. Tarkoitus"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Osapuolet harkitsevat yhteistyötä / liiketoimea koskien ___. Sopimuksen tarkoituksena on suojata osapuolten toisilleen luovuttama luottamuksellinen tieto."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"2. Luottamuksellinen tieto"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Luottamuksellisella tiedolla tarkoitetaan kaikkea suullisesti, kirjallisesti tai muulla tavoin luovutettua tietoa, joka koskee osapuolen liiketoimintaa, teknologiaa, asiakkaita, taloutta, strategioita tai muita vastaavia seikkoja."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"3. Salassapitovelvollisuus"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Kumpikin osapuoli sitoutuu:"}]},
      {"type":"bulletList","content":[
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"pitämään vastaanottamansa luottamuksellisen tiedon salassa"}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"olemaan käyttämättä tietoa muuhun kuin sovittuun tarkoitukseen"}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"rajoittamaan tiedon jakelun vain niille henkilöille, joiden on välttämätöntä tietää asiasta"}]}]}
      ]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"4. Poikkeukset"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Salassapitovelvollisuus ei koske tietoa, joka: (a) on tai tulee yleiseen tietoon ilman sopimusrikkomusta; (b) oli vastaanottavalla osapuolella jo entuudestaan; (c) on saatu sivulliselta ilman salassapitovelvollisuutta; (d) on kehitetty itsenäisesti."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"5. Voimassaolo"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Sopimus on voimassa ___ vuotta allekirjoituspäivästä lukien."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"6. Seuraamukset"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Sopimuksen rikkomisesta aiheutuu vahingonkorvausvelvollisuus. Osapuoli on oikeutettu hakemaan kieltomääräystä tuomioistuimelta."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"7. Sovellettava laki"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Sopimukseen sovelletaan Suomen lakia. Riitaisuudet ratkaistaan Helsingin käräjäoikeudessa."}]},
      {"type":"horizontalRule"},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Allekirjoitukset"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Paikka ja aika: ___, {{date}}"}]},
      {"type":"paragraph","content":[{"type":"text","text":" "}]},
      {"type":"paragraph","content":[{"type":"text","text":"___________________________        ___________________________"}]},
      {"type":"paragraph","content":[{"type":"text","text":"{{company_name}}                            ___"}]}
    ]
  }'::jsonb,
  true,
  50
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Muistio / Memo (general)
-- ============================================================
INSERT INTO document_templates (name, category, description, content, is_global, sort_order)
VALUES (
  'Muistio',
  'general',
  'Yleinen muistiopohja kokouksille ja palavereille',
  '{
    "type": "doc",
    "content": [
      {"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"MUISTIO"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Yhtiö: "},{"type":"text","text":"{{company_name}}"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Päivämäärä: "},{"type":"text","text":"{{date}}"}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Asia: "},{"type":"text","text":" "}]},
      {"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Läsnä: "},{"type":"text","text":" "}]},
      {"type":"horizontalRule"},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Tausta"}]},
      {"type":"paragraph","content":[{"type":"text","text":" "}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Käsitellyt asiat"}]},
      {"type":"orderedList","content":[
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":" "}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":" "}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":" "}]}]}
      ]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Päätökset ja toimenpiteet"}]},
      {"type":"bulletList","content":[
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Toimenpide: "},{"type":"text","text":"___ — Vastuuhenkilö: ___ — Aikataulu: ___"}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Toimenpide: "},{"type":"text","text":"___ — Vastuuhenkilö: ___ — Aikataulu: ___"}]}]}
      ]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Seuraava kokous"}]},
      {"type":"paragraph","content":[{"type":"text","text":" "}]},
      {"type":"horizontalRule"},
      {"type":"paragraph","content":[{"type":"text","text":"Muistion laati: ___"}]}
    ]
  }'::jsonb,
  true,
  60
)
ON CONFLICT DO NOTHING;
