"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { CodeBlock } from "@/components/ui/code-block";
import { Book, Server, Globe, Copy } from "lucide-react";

type TechStack = "nextjs" | "nodejs";
type Language = "js" | "ts";

const techStacks: TechStack[] = ["nextjs", "nodejs"];
const languages: Language[] = ["js", "ts"];

export default function Component() {
  const [selectedTech, setSelectedTech] = useState<TechStack>("nextjs");
  const [selectedLang, setSelectedLang] = useState<Language>("js");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Code copied!", {
      description: "The code has been copied to your clipboard.",
    });
  };

  const codeSnippets = {
    nextjs: {
      js: `// Middleware code for Next.js (JavaScript)
import { NextResponse } from "next/server";

export async function middleware(req) {
  try {
    let status;
    const cookies = req.cookies;
    const statusCookie = cookies.get('site-status');

    if (statusCookie) {
      status = statusCookie.value === 'true';
    } else {
      const res = await fetch(
        \`\${process.env.API_URL}/api/check-site-status?siteId=\${process.env.SITE_ID}\`
      );
      const data = await res.json();
      status = data.status;

      const response = NextResponse.next();
      response.cookies.set('site-status', status.toString(), {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });

      if (status === true) {
        return NextResponse.redirect(new URL("/site-down", req.url));
      }
      return response;
    }

    if (status === true) {
      return NextResponse.redirect(new URL("/site-down", req.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/:path*"],
};`,
      ts: `// Middleware code for Next.js (TypeScript)
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest): Promise<NextResponse> {
  try {
    let status: boolean;
    const cookies = req.cookies;
    const statusCookie = cookies.get('site-status');

    if (statusCookie) {
      status = statusCookie === 'true';
    } else {
      const res = await fetch(
        \`\${process.env.API_URL}/api/check-site-status?siteId=\${process.env.SITE_ID}\`
      );
      const data: { status: boolean } = await res.json();
      status = data.status;

      const response = NextResponse.next();
      response.cookies.set('site-status', status.toString(), {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });

      if (status === true) {
        return NextResponse.redirect(new URL("/site-down", req.url));
      }
      return response;
    }

    if (status === true) {
      return NextResponse.redirect(new URL("/site-down", req.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/:path*"],
};`,
    },
    nodejs: {
      js: `// Express middleware for Node.js (JavaScript)
const express = require('express');
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());

async function checkSiteStatus(req, res, next) {
  try {
    let status;
    const statusCookie = req.cookies['site-status'];

    if (statusCookie) {
      status = statusCookie === 'true';
    } else {
      const response = await fetch(
        \`\${process.env.API_URL}/api/check-site-status?siteId=\${process.env.SITE_ID}\`
      );
      const data = await response.json();
      status = data.status;

      res.cookie('site-status', status.toString(), {
        maxAge: 60 * 60 * 24 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
    }

    if (status === true) {
      return res.redirect('/site-down');
    }
    
    next();
  } catch (error) {
    console.error("Error in middleware:", error);
    next();
  }
}

app.use(checkSiteStatus);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/site-down', (req, res) => {
  res.send('The site is currently down for maintenance.');
});

app.listen(port, () => {
  console.log(\`Server running at http://localhost:\${port}\`);
});`,
      ts: `// Express middleware for Node.js (TypeScript)
import express, { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());

async function checkSiteStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let status: boolean;
    const statusCookie = req.cookies['site-status'];

    if (statusCookie) {
      status = statusCookie === 'true';
    } else {
      const response = await fetch(
        \`\${process.env.API_URL}/api/check-site-status?siteId=\${process.env.SITE_ID}\`
      );
      const data: { status: boolean } = await response.json();
      status = data.status;

      res.cookie('site-status', status.toString(), {
        maxAge: 60 * 60 * 24 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
    }

    if (status === true) {
      res.redirect('/site-down');
      return;
    }
    
    next();
  } catch (error) {
    console.error("Error in middleware:", error);
    next();
  }
}

app.use(checkSiteStatus);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/site-down', (req: Request, res: Response) => {
  res.send('The site is currently down for maintenance.');
});

app.listen(port, () => {
  console.log(\`Server running at http://localhost:\${port}\`);
});`,
    },
  };

  const docs = {
    nextjs: {
      title: "Site Status Checker and User Management System for Next.js",
      overview:
        "This system provides a comprehensive solution for managing site status and user data in a Next.js application. It includes middleware for checking site status, GraphQL resolvers for user management, and a dashboard for administrators.",
      installation: [
        "1. Install required dependencies:",
        "```\nnpm install next react react-dom @apollo/client graphql @prisma/client\n```",
        "2. Set up Prisma:",
        "```\nnpm install prisma --save-dev\nnpx prisma init\n```",
        "3. Configure your database connection in the `.env` file.",
        "4. Create the necessary schema files and run Prisma migrations:",
        "```\nnpx prisma migrate dev\n```",
        "5. Generate Prisma client:",
        "```\nnpx prisma generate\n```",
        "6. Create a `.env.local` file in your project root and add the following variables:",
        "```\nAPI_URL=http://your-api-url\nSITE_ID=your-site-id\nDATABASE_URL=your-database-url\n```",
      ],
      configuration: [
        "1. Set up the Apollo Client in your Next.js app.",
        "2. Create the necessary GraphQL schema and resolver files.",
        "3. Implement the middleware for site status checking.",
        "4. Set up the dashboard pages and components.",
        "5. Configure authentication (e.g., using NextAuth.js).",
        "6. Implement the API routes for data management.",
      ],
      howItWorks: [
        "1. The middleware checks the site status before processing any request.",
        "2. If the site is down, it redirects to a maintenance page.",
        "3. The GraphQL API handles user and child data management.",
        "4. The dashboard provides an interface for administrators to manage users and view statistics.",
        "5. The system uses Prisma for database operations and Apollo Client for GraphQL queries and mutations.",
      ],
      usage: [
        "1. Start the development server: `npm run dev`",
        "2. Access the dashboard at `/dashboard`",
        "3. Use the provided components and hooks to interact with the API and manage data.",
        "4. Implement the necessary pages and components for your specific use case.",
      ],
      testing: [
        "1. Write unit tests for individual components and functions.",
        "2. Create integration tests for API routes and GraphQL resolvers.",
        "3. Implement end-to-end tests for critical user flows.",
        "4. Test the site status middleware by simulating different scenarios.",
      ],
      troubleshooting: [
        "1. Check the server logs for any errors in the middleware or API routes.",
        "2. Verify that all environment variables are correctly set.",
        "3. Ensure that the database connection is properly configured.",
        "4. Check for any conflicts in GraphQL schema or resolver implementations.",
        "5. Verify that all required dependencies are installed and up to date.",
      ],
    },
    nodejs: {
      title:
        "Site Status Checker and User Management System for Node.js Express",
      overview:
        "This system provides a comprehensive solution for managing site status and user data in a Node.js Express application. It includes middleware for checking site status, GraphQL resolvers for user management, and a dashboard for administrators.",
      installation: [
        "1. Install required dependencies:",
        "```\nnpm install express apollo-server-express graphql @prisma/client cookie-parser dotenv\n```",
        "2. For TypeScript support, also install:",
        "```\nnpm install --save-dev typescript @types/express @types/node\n```",
        "3. Set up Prisma:",
        "```\nnpm install prisma --save-dev\nnpx prisma init\n```",
        "4. Configure your database connection in the `.env` file.",
        "5. Create the necessary schema files and run Prisma migrations:",
        "```\nnpx prisma migrate dev\n```",
        "6. Generate Prisma client:",
        "```\nnpx prisma generate\n```",
        "7. Create a `.env` file in your project root and add the following variables:",
        "```\nPORT=3000\nAPI_URL=http://your-api-url\nSITE_ID=your-site-id\nDATABASE_URL=your-database-url\n```",
      ],
      configuration: [
        "1. Set up the Express server and Apollo Server.",
        "2. Create the necessary GraphQL schema and resolver files.",
        "3. Implement the middleware for site status checking.",
        "4. Set up the dashboard routes and views.",
        "5. Configure authentication middleware.",
        "6. Implement the API routes for data management.",
      ],
      howItWorks: [
        "1. The middleware checks the site status before processing any request.",
        "2. If the site is down, it redirects to a maintenance page.",
        "3. The GraphQL API handles user and child data management.",
        "4. The dashboard provides an interface for administrators to manage users and view statistics.",
        "5. The system uses Prisma for database operations and Apollo Server for GraphQL queries and mutations.",
      ],
      usage: [
        "1. Start the server: `node app.js` (or `ts-node app.ts` for TypeScript)",
        "2. Access the dashboard at `/dashboard`",
        "3. Use the provided API endpoints to interact with the system and manage data.",
        "4. Implement the necessary routes and views for your specific use case.",
      ],
      testing: [
        "1. Write unit tests for individual functions and middleware.",
        "2. Create integration tests for API routes and GraphQL resolvers.",
        "3. Implement end-to-end tests for critical user flows.",
        "4. Test the site status middleware by simulating different scenarios.",
      ],
      troubleshooting: [
        "1. Check the server logs for any errors in the middleware or API routes.",
        "2. Verify that all environment variables are correctly set.",
        "3. Ensure that the database connection is properly configured.",
        "4. Check for any conflicts in GraphQL schema or resolver implementations.",
        "5. Verify that all required dependencies are installed and up to date.",
      ],
    },
  };

  const renderDocs = (tech: TechStack) => {
    const {
      title,
      overview,
      installation,
      configuration,
      howItWorks,
      usage,
      testing,
      troubleshooting,
    } = docs[tech];
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-lg">{overview}</p>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Installation</h2>
          <ol className="list-decimal list-inside space-y-1">
            {installation.map((step, index) => (
              <li key={index} className="mb-2">
                {step.startsWith("```") ? (
                  <pre className="bg-gray-100 p-2 rounded-md mt-1 overflow-x-auto">
                    <code>{step.replace(/```/g, "").trim()}</code>
                  </pre>
                ) : (
                  step
                )}
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Configuration</h2>
          <ul className="list-disc list-inside space-y-1">
            {configuration.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">How It Works</h2>
          <ol className="list-decimal list-inside space-y-1">
            {howItWorks.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </section>

        {usage && (
          <section>
            <h2 className="text-2xl font-semibold mb-2">Usage</h2>
            <ol className="list-decimal list-inside space-y-1">
              {usage.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-semibold mb-2">Testing</h2>
          <ul className="list-disc list-inside space-y-1">
            {testing.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Troubleshooting</h2>
          <ul className="list-disc list-inside space-y-1">
            {troubleshooting.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="nextjs" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          {techStacks.map((tech) => (
            <TabsTrigger
              key={tech}
              value={tech}
              onClick={() => setSelectedTech(tech)}
              className="flex items-center justify-center"
            >
              {tech === "nextjs" && <Book className="w-4 h-4 mr-2" />}
              {tech === "nodejs" && <Server className="w-4 h-4 mr-2" />}
              {tech.charAt(0).toUpperCase() + tech.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        {techStacks.map((tech) => (
          <TabsContent key={tech} value={tech}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                {renderDocs(tech)}
              </ScrollArea>
              <div>
                <Tabs defaultValue="js" className="w-full mb-4">
                  <TabsList>
                    {languages.map((lang) => (
                      <TabsTrigger
                        key={lang}
                        value={lang}
                        onClick={() => setSelectedLang(lang)}
                      >
                        {lang.toUpperCase()}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
                <div className="relative">
                  <CodeBlock
                    code={codeSnippets[tech][selectedLang]}
                    language={
                      selectedLang === "js" ? "javascript" : "typescript"
                    }
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(codeSnippets[tech][selectedLang])}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
