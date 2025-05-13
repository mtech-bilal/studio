// src/sanity/schemas/role.ts
import { defineType, defineField } from 'sanity';
import { ShieldCheck } from 'lucide-react';

export default defineType({
  name: 'role',
  title: 'Role',
  type: 'document',
  icon: ShieldCheck,
  fields: [
    defineField({
      name: 'name',
      title: 'Internal Name',
      type: 'slug',
      description: 'Internal identifier for the role (e.g., "admin", "physician"). Should be unique and preferably lowercase with underscores if needed.',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: async (value, context) => {
            const {document, getClient} = context
            const client = getClient({apiVersion: '2024-05-13'})
            const id = document?._id.replace(/^drafts\./, '')
            const params = {
              draft: `drafts.${id}`,
              published: id,
              name: value,
            }
            const query = `!defined(*[
              !(_id in [$draft, $published]) &&
              name.current == $name
            ][0]._id)`
            const result = await client.fetch(query, params)
            return result
          }
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Display Title',
      type: 'string',
      description: 'User-friendly title for the role (e.g., "Administrator", "Physician").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: 'description',
        title: 'Description',
        type: 'text',
        rows: 2,
        description: 'Optional: A brief description of the role and its permissions.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'name.current',
    },
  },
});
