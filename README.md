# SVG to TSX

Keeping icons in sync between design and code is tedious. **SVG to TSX** automates the entire workflow by converting Figma icons to React components and pushing changes directly to your Git repositories.

## See SVG to TSX in action

![Demo video or GIF here](./assets/SVGToTSX.gif)

## Benefits

- **Designers** no longer need to manually export SVGs from Figma every time icons are updated or added.
- **Developers** save time by skipping manual SVG-to-TSX conversion, prop configuration, and copy-pasting code.
- **Direct Git integration** creates pull requests automatically, making the review process seamless.
- **Multi-platform support** works with GitHub, GitLab, and Bitbucket (including self-hosted instances).
- **Type-safe components** generated with TypeScript for better developer experience.
- **Consistent structure** ensures all icon components follow the same pattern and props interface.

## Quick Setup (5 Minutes)

### 1. Generate Access Token

Choose your Git hosting platform and create an access token:

- **GitHub**: Generate a [fine-grained Personal Access Token](https://github.com/settings/tokens?type=beta) with the "Contents" repository permission set to "Read and write".
- **GitLab**: Generate a [Personal Access Token](https://gitlab.com/-/profile/personal_access_tokens) with the `api` scope.
- **Bitbucket**: Generate a [Repository Access Token](https://bitbucket.org/account/settings/app-passwords/) with the `repository:write` permission.


### 2. Export Icons

1. Select icon components in Figma
2. Review the generated TSX code
3. Click **Convert and Export**
4. Configure:
   - Select Git platform
   - Access Token
   - Repository URL
   - Feature branch name
   - Icon directory path
   - Commit message
5. Click **Export**

Icons will be converted to TSX components and pushed to a new branch in your repository, ready for review and merge.

## Supported Git Platforms

- GitHub 
- GitLab
- Bitbucket

## Features

- **Automatic SVG to TSX conversion** using industry-standard SVGR
- **Real-time preview** of selected icons
- **Git integration** with automatic PR creation
- **Persistent settings** saved per Figma file
- **Component name preservation** keeps Figma naming in sync with code
- **TypeScript support** for type-safe React components

## How It Works

1. **Select** icon components in Figma
2. **Convert** icons are automatically transformed to TSX format
3. **Configure** repository, branch, and commit details
4. **Export** plugin creates a new branch and pull request with your icons

## Requirements

- Figma desktop app or browser
- Git repository (GitHub, GitLab, or Bitbucket)
- Access token with write permissions

## Support & Feedback

Have questions or suggestions? We'd love to hear from you!

- Open an issue on our [GitHub repository](https://github.com/korkt-kim/svg-to-tsx)
- Drop a comment on the [Figma Community page](https://figma.com/community)

## Show Your Support

If SVG to TSX saves you time, let us know!

- Give us a star on GitHub
- Like the plugin on Figma Community
- Share with your team

---

Made with care for designers and developers who value automation
