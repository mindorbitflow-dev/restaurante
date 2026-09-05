-- =====================================================================
-- CORRECCIÓN Y CREACIÓN DE USUARIO ADMINISTRADOR EN SUPABASE AUTH
-- =====================================================================
-- Ejecuta este script en Supabase: SQL Editor -> New query -> Run
-- Soluciona el error "Database error querying schema" convirtiendo campos NULL a ''
-- y asegurando credenciales admin@restaurante.com / admin123
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Reparar usuarios existentes que tengan tokens en NULL (causa de Database error querying schema)
UPDATE auth.users
SET 
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change = COALESCE(email_change, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  phone_change = COALESCE(phone_change, ''),
  phone_change_token = COALESCE(phone_change_token, ''),
  reauthentication_token = COALESCE(reauthentication_token, ''),
  encrypted_password = crypt('admin123', gen_salt('bf')),
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  updated_at = now()
WHERE email = 'admin@restaurante.com';

-- 2. Si no existía, insertarlo con todos los campos de texto inicializados en ''
DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  user_email TEXT := 'admin@restaurante.com';
  user_password TEXT := 'admin123';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = user_email) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change,
      email_change_token_current,
      phone_change,
      phone_change_token,
      reauthentication_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      user_email,
      crypt(user_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"admin"}',
      now(),
      now(),
      '', '', '', '', '', '', '', ''
    );

    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      new_user_id,
      new_user_id,
      format('{"sub":"%s","email":"%s"}', new_user_id, user_email)::jsonb,
      'email',
      user_email,
      now(),
      now(),
      now()
    );
  END IF;
END $$;
