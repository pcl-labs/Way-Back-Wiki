# Way Back Wiki

[Way Back Wiki](https://www.waybackwiki.org) is an open-source project that enables users to explore the history of Wikipedia articles. It offers a simple interface to view article revisions, visualize changes over time, and compare different versions of articles. This project is beginner-friendly, making it an excellent starting point for new developers who want to contribute to an open-source project.

## Features

- **Search Wikipedia articles**: Easily find any Wikipedia article by searching for it directly.
- **View article revisions**: A heatmap visualization shows when and how frequently an article has been revised.
- **Compare article versions**: Highlight differences between two versions of an article.

## Tech Stack

Way Back Wiki uses modern web technologies to deliver a fast and responsive experience:

- [**Next.js**](https://nextjs.org/): A React framework for building server-rendered and static web applications.
- [**TypeScript**](https://www.typescriptlang.org/): A strongly typed programming language that builds on JavaScript.
- [**Tailwind CSS**](https://tailwindcss.com/): A utility-first CSS framework for styling the interface.
- [**Shadcn UI**](https://ui.shadcn.com/): For customizable UI components.
- [**React Calendar Heatmap**](https://github.com/kevinsqi/react-calendar-heatmap): A React component for visualizing time-series data in a calendar heatmap format.

## Getting Started

Follow these steps to get the project up and running on your local machine:

1. **Clone the repository**:
   ```
   git clone https://github.com/pcl-labs/Way-Back-Wiki.git
   cd Way-Back-Wiki
   ```

2. **Install dependencies** (We use [pnpm](https://pnpm.io/) for package management):
   ```
   pnpm install
   ```

3. **Run the development server**:
   ```
   pnpm run dev
   ```

4. **View the project**: Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the app in action.

## Development Tips

- **Next.js**: This project uses Next.js for server-side rendering and static site generation. Learn more [here](https://nextjs.org/docs).
- **TypeScript**: We're using TypeScript to make the code more predictable and easier to debug. Check out the [official documentation](https://www.typescriptlang.org/docs/).
- **Tailwind CSS**: Tailwind is a powerful CSS utility framework. Refer to their [getting started guide](https://tailwindcss.com/docs/installation).

## Contributing

We welcome contributions of all kinds! If this is your first time contributing to an open-source project, we've got you covered with a step-by-step guide.

### How to Contribute

1. **Fork the repository**: Go to the [Way Back Wiki repository](https://github.com/pcl-labs/Way-Back-Wiki) and click the "Fork" button.
2. **Clone your fork**:
   ```
   git clone https://github.com/yourusername/Way-Back-Wiki.git
   cd Way-Back-Wiki
   ```
3. **Create a new branch**:
   ```
   git checkout -b your-feature-branch
   ```
4. **Make your changes**: Write clean and readable code, ensuring your changes fit well with the rest of the project.
5. **Commit your changes**:
   ```
   git commit -m "Description of changes"
   ```
6. **Push to GitHub**:
   ```
   git push origin your-feature-branch
   ```
7. **Create a pull request**: Once you're satisfied with your changes, go to the original repository and submit a pull request from your branch.

### Helpful Links

- [GitHub Issues](https://github.com/pcl-labs/Way-Back-Wiki/issues): Check the open issues to see what you can work on.
- [Pull Requests](https://github.com/pcl-labs/Way-Back-Wiki/pulls): See existing pull requests or create a new one.

### Development Process

1. Issues are tracked on GitHub in the [Issues tab](https://github.com/pcl-labs/Way-Back-Wiki/issues).
2. Pull requests are reviewed by the maintainers. We encourage you to leave helpful comments on others' pull requests as well!
3. Continuous Integration (CI) checks will be automatically run on all pull requests.
4. Once approved and passing CI, pull requests will be merged into the main branch.

### AI Prompt Instructions

If you're using AI to assist with your contributions, here are some guidelines to ensure your code aligns with our project standards:

```
You are an expert in TypeScript, Node.js, Next.js App Router, React, Shadcn UI, and Tailwind.

Code Style and Structure
- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Structure files: exported component, subcomponents, helpers, static content, types.

Naming Conventions
- Use lowercase with dashes for directories (e.g., components/auth-wizard).
- Favor named exports for components.

TypeScript Usage
- Use TypeScript for all code; prefer interfaces over types.
- Avoid enums; use maps instead.
- Use functional components with TypeScript interfaces.

Syntax and Formatting
- Use the "function" keyword for pure functions.
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.
- Use declarative JSX.

UI and Styling
- Use Shadcn UI, and Tailwind for components and styling.
- Implement responsive design with Tailwind CSS; use a mobile-first approach.

Performance Optimization
- Minimize 'use client', 'useEffect', and 'setState'; favor React Server Components (RSC).
- Wrap client components in Suspense with fallback.
- Use dynamic loading for non-critical components.
- Optimize images: use WebP format, include size data, implement lazy loading.

Key Conventions
- Use 'nuqs' for URL search parameter state management.
- Optimize Web Vitals (LCP, CLS, FID).
- Limit 'use client':
  - Favor server components and Next.js SSR.
  - Use only for Web API access in small components.
  - Avoid for data fetching or state management.

Follow Next.js docs for Data Fetching, Rendering, and Routing.
```

When using AI to generate code or get assistance, provide this prompt to ensure the output aligns with our project's standards and best practices.

## Next Steps for Development

Here are a few ideas of what we plan to work on next. Feel free to contribute or suggest new ideas:

- Implement user authentication to save favorite articles and revisions
- Add more detailed statistics about article revisions
- Improve performance for large articles with many revisions
- Enhance mobile UI for better usability on smaller screens
- Integrate with more Wikimedia projects beyond Wikipedia

## License

This project is open source and available under the [MIT License](https://github.com/pcl-labs/Way-Back-Wiki/blob/main/LICENSE).

## Deployment

Way Back Wiki is deployed on [Vercel](https://vercel.com) and can be accessed at [www.waybackwiki.org](https://www.waybackwiki.org).

## Contact

For any questions or concerns, please open an issue on this repository.