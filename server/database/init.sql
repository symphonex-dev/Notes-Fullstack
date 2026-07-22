-- ============================================================================
-- Notes Full Stack — Script d'initialisation PostgreSQL
-- Recrée entièrement le schéma depuis zéro. Idempotent : peut être relancé
-- sans erreur grâce aux DROP ... IF EXISTS en tête de script.
-- Usage : psql -U <user> -d <database> -f database/init.sql
-- ============================================================================

-- Suppression propre (ordre inverse des dépendances : notes avant users)
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS users;

-- ----------------------------------------------------------------------------
-- Table users
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(255)  NOT NULL,
    password_hash VARCHAR(255)  NOT NULL,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

    -- Un email ne peut appartenir qu'à un seul compte
    CONSTRAINT users_email_unique UNIQUE (email),
    -- Garde-fous contre des données vides ou invalides
    CONSTRAINT users_name_not_blank  CHECK (length(trim(name)) > 0),
    CONSTRAINT users_email_format    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Recherche/connexion par email : très fréquente, l'unique constraint crée
-- déjà un index, mais on le nomme explicitement pour la clarté du schéma.
CREATE INDEX idx_users_email ON users (email);

-- ----------------------------------------------------------------------------
-- Table notes
-- ----------------------------------------------------------------------------
CREATE TABLE notes (
    id         SERIAL PRIMARY KEY,
    title      VARCHAR(200) NOT NULL,
    content    TEXT         NOT NULL DEFAULT '',
    user_id    INTEGER      NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT notes_title_not_blank CHECK (length(trim(title)) > 0),

    -- Clé étrangère vers users : si un utilisateur est supprimé, ses notes
    -- le sont aussi (cohérence des données, pas de notes orphelines).
    CONSTRAINT fk_notes_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);

-- Chaque requête de listing filtre par user_id (WHERE user_id = $1) :
-- index indispensable pour éviter un scan complet de la table.
CREATE INDEX idx_notes_user_id ON notes (user_id);

-- Le dashboard trie les notes par date de mise à jour décroissante :
-- index composite pour accélérer ce tri filtré par utilisateur.
CREATE INDEX idx_notes_user_updated ON notes (user_id, updated_at DESC);

-- ----------------------------------------------------------------------------
-- Trigger : maintien automatique de updated_at
-- ----------------------------------------------------------------------------
-- Plutôt que de compter sur chaque requête UPDATE pour fixer updated_at,
-- un trigger PostgreSQL garantit que la colonne est toujours exacte,
-- même en cas de mise à jour directe en base (psql, autre service...).
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
