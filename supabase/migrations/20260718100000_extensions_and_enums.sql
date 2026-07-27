-- Extensions and shared enum types used across the CMS schema.

create extension if not exists pgcrypto;

-- Shared editorial workflow status, used by every content table that goes
-- through the admin's Draft / Publish toggle. Simple on/off concepts
-- (navigation visibility, form active state) intentionally use a plain
-- boolean instead, since they aren't an editorial workflow.
create type content_status as enum ('draft', 'published');
