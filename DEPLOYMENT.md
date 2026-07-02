# Deployment Checklist

## Environment

Set these variables in Vercel or your hosting provider:

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_RESUME_URL=
```

`NEXT_PUBLIC_RESUME_URL` is optional because the admin Settings page can store the resume URL in Supabase.

## Supabase

Run `supabase-posts-links.sql` in the Supabase SQL editor.

Required tables and columns:

- `posts.github`
- `posts.demo`
- `site_settings`
- `contact_messages`

Required storage:

- Public bucket named `images`
- Upload paths used by the app: `uploads/` and `resumes/`

## Verification

Run locally before deploying:

```bash
npm run build
```

After deploy, verify:

- `/`
- `/about`
- `/blog`
- `/projects`
- `/admin/login`
- `/admin/settings`

## Admin Checks

- Upload a resume in `/admin/settings`
- Upload an About avatar in `/admin/settings`
- Create or edit a project with GitHub and Live URL fields
- Submit the contact form and verify the message appears in the admin dashboard
