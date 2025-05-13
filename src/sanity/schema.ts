// src/sanity/schema.ts
import type { SchemaTypeDefinition } from 'sanity';

import role from './schemas/role';
import user from './schemas/user';
import physician from './schemas/physician';
import customer from './schemas/customer';
import booking from './schemas/booking';
import payment from './schemas/payment';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [role, user, physician, customer, booking, payment],
};
