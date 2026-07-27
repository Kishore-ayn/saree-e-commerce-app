-- Gap found while building the Collections admin (Phase 8.2): the existing
-- Collection interface has an optional relatedAreaLink {label, href}, used
-- by a couple of real collections today, that Phase 3 never added a column
-- for. A real FK (rather than a raw stored href) so the link can't go stale
-- if an area's slug changes; related_area_label keeps the custom display
-- text ("Kanchipuram Sarees in Gajuwaka") since that isn't just the area's name.
alter table collections
  add column related_area_id uuid references areas (id) on delete set null,
  add column related_area_label text;
