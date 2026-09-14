-- After creating the first user in Authentication → Users (email + password),
-- copy the user UUID and run (edit the values):

insert into public.admin_users (user_id, email)
values (
  '00000000-0000-0000-0000-000000000000',
  'andrey@agray.art'
);
