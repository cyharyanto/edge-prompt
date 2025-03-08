export async function getMaterial(id: string): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id, project_id, title, content, focus_area, metadata, file_path, file_type, file_size, status, created_at FROM materials WHERE id = ?',
      [id],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!row) {
          resolve(null);
          return;
        }
        
        // Parse metadata JSON if it exists
        if (row.metadata) {
          try {
            row.metadata = JSON.parse(row.metadata);
          } catch (e) {
            console.warn(`Failed to parse metadata for material ${id}`, e);
            row.metadata = {};
          }
        }
        
        resolve({
          id: row.id,
          projectId: row.project_id,
          title: row.title,
          content: row.content,
          focusArea: row.focus_area,
          metadata: row.metadata || {},
          filePath: row.file_path,
          fileType: row.file_type,
          fileSize: row.file_size,
          status: row.status,
          createdAt: row.created_at
        });
      }
    );
  });
}

export async function getPromptTemplate(id: string): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id, name, version, type, content, description, created_at FROM prompt_templates WHERE id = ?',
      [id],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!row) {
          resolve(null);
          return;
        }
        
        // Parse content JSON if it exists
        if (row.content) {
          try {
            row.content = JSON.parse(row.content);
          } catch (e) {
            // If not valid JSON, keep as string
            console.warn(`Prompt template ${id} content is not valid JSON, keeping as string`);
          }
        }
        
        resolve({
          id: row.id,
          name: row.name,
          version: row.version,
          type: row.type,
          content: row.content,
          description: row.description,
          createdAt: row.created_at
        });
      }
    );
  });
} 