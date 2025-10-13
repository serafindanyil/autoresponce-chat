# Models Directory

Place Mongoose schemas and models here. Export public models via `index.ts` and keep schema configuration co-located with the model file.

Example workflow:

1. Define the interface describing the document shape.
2. Configure the schema, enabling timestamps and validation rules.
3. Export the compiled model and reuse it across controllers/services.
