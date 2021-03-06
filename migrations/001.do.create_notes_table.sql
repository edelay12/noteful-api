CREATE TABLE IF NOT EXISTS notes_table (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    content TEXT,
    foldernum INTEGER REFERENCES folders_table(id_key) NOT NULL on DELETE CASCADE,
    modified TIMESTAMP NOT NULL DEFAULT now()
);