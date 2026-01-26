/**
 * This file was automatically generated based on your preset configuration.
 *
 * For better type checking and IntelliSense:
 * 1. Install azion as dev dependency:
 *    npm install -D azion
 *
 * 2. Use defineConfig:
 *    import { defineConfig } from 'azion'
 *
 * 3. Replace the configuration with defineConfig:
 *    export default defineConfig({
 *      // Your configuration here
 *    })
 *
 * For more configuration options, visit:
 * https://github.com/aziontech/lib/tree/main/packages/config
 */

module.exports = {
  build: {
    preset: "html",
    polyfills: true,
  },
  storage: [
    {
      name: "test-static-site-20260120171438",
      prefix: "20260120171429",
      dir: "./www",
      workloadsAccess: "read_only",
    },
  ],
  connectors: [
    {
      name: "test-static-site",
      active: true,
      type: "storage",
      attributes: {
        bucket: "test-static-site-20260120171438",
        prefix: "20260120171429",
      },
    },
  ],
  applications: [
    {
      name: "test-static-site",
      cache: [
        {
          name: "images-cache-setting",
          browser: {
            maxAgeSeconds: 1296000,
          },
          edge: {
            maxAgeSeconds: 1296000,
          },
        },
        {
          name: "test-static-site",
          browser: {
            maxAgeSeconds: 7200,
          },
          edge: {
            maxAgeSeconds: 7200,
          },
        },
      ],
      rules: {
        request: [
          {
            name: "Deliver Images",
            description: "Deliver images with long cache TTL",
            active: true,
            criteria: [
              [
                {
                  variable: "${uri}",
                  conditional: "if",
                  operator: "matches",
                  argument: "\.(jpg|jpeg|png|gif|bmp|webp|svg|ico)$",
                },
              ],
            ],
            behaviors: [
              {
                type: "set_connector",
                attributes: {
                  value: "test-static-site",
                },
              },
              {
                type: "set_cache_policy",
                attributes: {
                  value: "images-cache-setting",
                },
              },
              {
                type: "deliver",
              },
            ],
          },
          {
            name: "Deliver Static Assets and Set Cache Policy",
            description:
              "Deliver static assets directly from storage and set cache policy",
            active: true,
            criteria: [
              [
                {
                  variable: "${uri}",
                  conditional: "if",
                  operator: "matches",
                  argument:
                    "\.(ttf|otf|woff|woff2|eot|pdf|doc|docx|xls|xlsx|ppt|pptx|mp4|webm|mp3|wav|ogg|css|js|json|xml|html|txt|csv|zip|rar|7z|tar|gz|webmanifest|map|md|yaml|yml)$",
                },
              ],
            ],
            behaviors: [
              {
                type: "set_connector",
                attributes: {
                  value: "test-static-site",
                },
              },
              {
                type: "set_cache_policy",
                attributes: {
                  value: "test-static-site",
                },
              },
              {
                type: "deliver",
              },
            ],
          },
          {
            name: "Redirect to index.html",
            description: "Handle directory requests by rewriting to index.html",
            active: true,
            criteria: [
              [
                {
                  variable: "${uri}",
                  conditional: "if",
                  operator: "matches",
                  argument: ".*/$",
                },
              ],
            ],
            behaviors: [
              {
                type: "set_connector",
                attributes: {
                  value: "test-static-site",
                },
              },
              {
                type: "rewrite_request",
                attributes: {
                  value: "${uri}index.html",
                },
              },
            ],
          },
          {
            name: "Redirect to index.html for Subpaths",
            description: "Handle subpath requests by rewriting to index.html",
            active: true,
            criteria: [
              [
                {
                  variable: "${uri}",
                  conditional: "if",
                  operator: "matches",
                  argument: "^(?!.*\/$)(?![\s\S]*\.[a-zA-Z0-9]+$).*",
                },
              ],
            ],
            behaviors: [
              {
                type: "set_connector",
                attributes: {
                  value: "test-static-site",
                },
              },
              {
                type: "rewrite_request",
                attributes: {
                  value: "${uri}/index.html",
                },
              },
            ],
          },
        ],
        response: [],
      },
    },
  ],
  workloads: [
    {
      name: "test-static-site",
      active: true,
      infrastructure: 1,
      protocols: {
        http: {
          versions: ["http1", "http2"],
          httpPorts: [80],
          httpsPorts: [443],
          quicPorts: null,
        },
      },
      deployments: [
        {
          name: "test-static-site",
          current: true,
          active: true,
          strategy: {
            type: "default",
            attributes: {
              application: "test-static-site",
            },
          },
        },
      ],
    },
  ],
};
