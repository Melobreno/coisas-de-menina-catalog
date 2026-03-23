-- Create RPC function to securely assign admin role by email
CREATE OR REPLACE FUNCTION public.assign_admin_role_by_email(target_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_target_user_id UUID;
BEGIN
    -- 1. Check if the calling user is an admin
    IF NOT public.has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Acesso negado: Apenas administradores podem atribuir roles.';
    END IF;

    -- 2. Find the target user ID by email
    SELECT id INTO v_target_user_id
    FROM auth.users
    WHERE email = target_email;

    IF v_target_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuário não encontrado com o e-mail fornecido.';
    END IF;

    -- 3. Insert the user_roles table with 'admin' role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;
