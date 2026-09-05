-- =====================================================================
-- CREACIÓN DE USUARIO ADMINISTRADOR EN SUPABASE AUTH
-- =====================================================================
-- Ejecuta este script en Supabase: SQL Editor -> New query -> Run
-- Crea el usuario admin@restaurante.com con contraseña admin123
-- y correo ya confirmado automáticamente.
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  user_email TEXT := 'admin@restaurante.com';
  user_password TEXT := 'admin123';
BEGIN
  -- Si el usuario ya existe en auth.users, actualiza la contraseña y confirma correo
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = user_email) THEN
    UPDATE auth.users
    SET 
      encrypted_password = crypt(user_password, gen_salt('bf')),
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      updated_at = now()
    WHERE email = user_email;
  ELSE
    -- Insertar el nuevo usuario en auth.users
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
      confirmation_token
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
      ''
    );

    -- Insertar la identidad correspondiente en auth.identities
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
