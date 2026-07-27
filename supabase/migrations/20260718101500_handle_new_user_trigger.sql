-- Closes a gap from Phase 5: nothing previously created a `profiles` row
-- when a new auth.users row appeared, leaving that as a manual step
-- (docs/setup.md step 5). New users default to 'editor' -- the least
-- privileged role -- promotion to 'admin' is a deliberate action taken
-- afterwards via the admin panel, never automatic.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    'editor'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

comment on function public.handle_new_user is 'Auto-creates a profiles row (role=editor) for every new auth.users row.';

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
