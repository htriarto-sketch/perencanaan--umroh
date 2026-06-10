# Deployment Guide: Program Perencanaan Umroh

This project is optimized for deployment on modern cloud platforms (Vercel, Netlify).

## Prerequisites

1.  **GitHub Repository**: Ensure you have pushed your code to a GitHub repository.
    ```bash
    # (If you haven't pushed yet)
    git remote add origin https://github.com/<your-username>/<your-repo-name>.git
    git branch -M main
    git push -u origin main
    ```

## Deployment Steps (Vercel - Recommended)

1.  Log in to [Vercel](https://vercel.com/) with your GitHub account.
2.  Click **"Add New"** > **"Project"**.
3.  Import the repository created for this project.
4.  **Configure Environment Variables** (CRITICAL): In the Vercel project settings, go to **Settings > Environment Variables** and add the following:
    - `VITE_SUPABASE_URL`: (Your Supabase URL)
    - `VITE_SUPABASE_ANON_KEY`: (Your Supabase Anon Key)
5.  Click **"Deploy"**.

## Post-Deployment

- **Custom Domain**: In your Vercel/Netlify dashboard, you can map a custom domain if you have one.
- **Supabase Auth**: Ensure that your Supabase project settings allow the new production URL as a callback/redirect URL (in **Authentication > URL Configuration**).

---

_Maintained by Gemini CLI Agent._
