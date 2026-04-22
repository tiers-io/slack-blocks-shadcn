// Fixtures exercise the full upstream surface so the left/right diff
// highlights real parity gaps. Each one has a short name + raw blocks.
//
// `slack-templates.json` was scraped from Slack's own Block Kit Builder
// (76 templates across Agents / Markdown / Section / Actions / Divider /
// Image / Context / Input / Header / Rich text / Table / Context Actions /
// Card / Carousel / Salesforce Record Card).

import slackTemplates from "./slack-templates.json";
import slackGalleryTemplates from "./slack-gallery-templates.json";

export interface Fixture {
  name: string;
  description: string;
  blocks: unknown[];
}

const welcome: Fixture = {
  name: "Welcome",
  description: "Section + mrkdwn link + divider + context",
  blocks: [
    {
      type: "header",
      text: { type: "plain_text", text: "Welcome to the playground" },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "This is a *side-by-side* comparison between `slack-blocks-to-jsx` (upstream) and `@tiers-io/slack-blocks-shadcn` (our port). Visit <https://github.com/tiers-io/slack-blocks-shadcn|the repo>.",
      },
    },
    { type: "divider" },
    {
      type: "context",
      elements: [
        {
          type: "image",
          image_url: "https://placehold.co/32x32/ea580c/fff?text=T",
          alt_text: "Tiers",
        },
        { type: "mrkdwn", text: "Rendered by Tiers" },
      ],
    },
  ],
};

const richText: Fixture = {
  name: "Rich text",
  description: "Styled runs + list + code block + quote",
  blocks: [
    {
      type: "rich_text",
      elements: [
        {
          type: "rich_text_section",
          elements: [
            { type: "text", text: "Mixing ", style: {} },
            { type: "text", text: "bold", style: { bold: true } },
            { type: "text", text: ", " },
            { type: "text", text: "italic", style: { italic: true } },
            { type: "text", text: ", " },
            { type: "text", text: "strike", style: { strike: true } },
            { type: "text", text: ", and " },
            { type: "text", text: "underline", style: { underline: true } },
            { type: "text", text: " in one run." },
          ],
        },
        {
          type: "rich_text_list",
          style: "bullet",
          elements: [
            {
              type: "rich_text_section",
              elements: [{ type: "text", text: "First bullet" }],
            },
            {
              type: "rich_text_section",
              elements: [{ type: "text", text: "Second bullet" }],
            },
          ],
        },
        {
          type: "rich_text_preformatted",
          elements: [{ type: "text", text: "$ pnpm test --run" }],
        },
        {
          type: "rich_text_quote",
          elements: [
            {
              type: "text",
              text: "To be, or not to be, that is the question.",
            },
          ],
        },
      ],
    },
  ],
};

const sectionWithFields: Fixture = {
  name: "Section fields",
  description: "Two-column fields + mrkdwn",
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Farmhouse* — rustic modern home in Vermont",
      },
      fields: [
        { type: "mrkdwn", text: "*Type*\nCabin" },
        { type: "mrkdwn", text: "*Price*\n$225/night" },
        { type: "mrkdwn", text: "*Sleeps*\n6" },
        { type: "mrkdwn", text: "*Rating*\n★★★★½" },
      ],
    },
  ],
};

const interactive: Fixture = {
  name: "Interactive",
  description: "Buttons, select, datepicker, checkboxes, overflow",
  blocks: [
    {
      type: "actions",
      elements: [
        {
          type: "button",
          action_id: "approve",
          text: { type: "plain_text", text: "Approve" },
          style: "primary",
        },
        {
          type: "button",
          action_id: "deny",
          text: { type: "plain_text", text: "Deny" },
          style: "danger",
        },
        {
          type: "static_select",
          action_id: "priority",
          placeholder: { type: "plain_text", text: "Pick priority" },
          options: [
            {
              text: { type: "plain_text", text: "Low" },
              value: "low",
            },
            {
              text: { type: "plain_text", text: "Medium" },
              value: "med",
            },
            {
              text: { type: "plain_text", text: "High" },
              value: "high",
            },
          ],
        },
        {
          type: "datepicker",
          action_id: "due",
          initial_date: "2026-05-01",
        },
        {
          type: "overflow",
          action_id: "row_menu",
          options: [
            {
              text: { type: "plain_text", text: "Edit" },
              value: "edit",
            },
            {
              text: { type: "plain_text", text: "Delete" },
              value: "delete",
            },
            {
              text: { type: "plain_text", text: "Open docs" },
              value: "docs",
              url: "https://api.slack.com/reference/block-kit/block-elements#overflow",
            },
          ],
        },
      ],
    },
    {
      type: "actions",
      elements: [
        {
          type: "checkboxes",
          action_id: "notifications",
          options: [
            {
              text: { type: "plain_text", text: "Email" },
              value: "email",
            },
            {
              text: { type: "plain_text", text: "SMS" },
              value: "sms",
            },
            {
              text: { type: "plain_text", text: "Push" },
              value: "push",
            },
          ],
          initial_options: [
            {
              text: { type: "plain_text", text: "Email" },
              value: "email",
            },
          ],
        },
        {
          type: "radio_buttons",
          action_id: "severity",
          options: [
            {
              text: { type: "plain_text", text: "Low" },
              value: "low",
            },
            {
              text: { type: "plain_text", text: "Critical" },
              value: "critical",
            },
          ],
        },
      ],
    },
  ],
};

const image: Fixture = {
  name: "Image",
  description: "Image block with title",
  blocks: [
    {
      type: "image",
      image_url: "https://placehold.co/640x320/334155/e5e7eb?text=Block+Kit",
      alt_text: "A placeholder illustration",
      title: { type: "plain_text", text: "Build dashboard" },
    },
  ],
};

const markdownTable: Fixture = {
  name: "Markdown GFM",
  description: "markdown block with GFM table",
  blocks: [
    {
      type: "markdown",
      text: "| Env | Status | Deployed |\n|---|---|---|\n| prod | ✅ green | 2m ago |\n| staging | ⚠️ degraded | 30m ago |\n| dev | 🔧 maintenance | — |\n\n- Task lists work too\n- [x] write spec\n- [ ] ship it",
    },
  ],
};

const inputs: Fixture = {
  name: "Inputs",
  description: "plain_text / number / email / url inputs inside input blocks",
  blocks: [
    {
      type: "input",
      label: { type: "plain_text", text: "Full name" },
      element: {
        type: "plain_text_input",
        action_id: "name",
        placeholder: { type: "plain_text", text: "Your name" },
      },
    },
    {
      type: "input",
      label: { type: "plain_text", text: "Age" },
      element: {
        type: "number_input",
        action_id: "age",
        is_decimal_allowed: false,
        placeholder: { type: "plain_text", text: "18" },
      },
    },
    {
      type: "input",
      label: { type: "plain_text", text: "Email" },
      element: {
        type: "email_text_input",
        action_id: "email",
        placeholder: { type: "plain_text", text: "you@example.com" },
      },
    },
  ],
};

const large: Fixture = {
  "name": "Large example",
  "description": "example",
  "blocks": [
  {
    "type": "rich_text",
    "elements": [
      {
        "type": "rich_text_section",
        "elements": [
          {
            "type": "text",
            "text": "This is my friend ",
            "style": {
              "bold": true,
              "code": true,
              "italic": true,
              "strike": true
            }
          },
          {
            "type": "user",
            "user_id": "U2TEST",
            "style": {
              "bold": true,
              "italic": true,
              "strike": true
            }
          },
          {
            "type": "text",
            "text": "."
          }
        ]
      }
    ]
  },
  {
    "type": "rich_text",
    "block_id": "9xF+h2kh21",
    "elements": [
      {
        "type": "rich_text_section",
        "elements": [
          {
            "type": "text",
            "text": "This is a rich text section with regular text. "
          },
          {
            "type": "text",
            "text": "This is bold",
            "style": {
              "bold": true
            }
          },
          {
            "type": "text",
            "text": ". "
          },
          {
            "type": "text",
            "text": "This is italics.",
            "style": {
              "italic": true
            }
          },
          {
            "type": "text",
            "text": " ",
            "style": {
              "bold": true,
              "italic": true
            }
          },
          {
            "type": "text",
            "text": "This is strikethrough.",
            "style": {
              "strike": true
            }
          },
          {
            "type": "text",
            "text": " "
          },
          {
            "type": "text",
            "text": "This is code.",
            "style": {
              "code": true
            }
          },
          {
            "type": "text",
            "text": "\n\n"
          }
        ]
      },
      {
        "type": "rich_text_list",
        "elements": [
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": "This is an"
              }
            ]
          },
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": "ordered"
              }
            ]
          },
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": "list"
              }
            ]
          }
        ],
        "style": "ordered",
        "indent": 0,
        "border": 0
      },
      {
        "type": "rich_text_section",
        "elements": [
          {
            "type": "text",
            "text": "\n"
          }
        ]
      },
      {
        "type": "rich_text_list",
        "elements": [
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": "This is an"
              }
            ]
          },
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": "unordered"
              }
            ]
          },
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": "list"
              }
            ]
          }
        ],
        "style": "bullet",
        "indent": 8,
        "border": 1
      },
      {
        "type": "rich_text_section",
        "elements": [
          {
            "type": "text",
            "text": "\n"
          }
        ]
      },
      {
        "type": "rich_text_quote",
        "elements": [
          {
            "type": "text",
            "text": "This is a \ntext quote"
          }
        ]
      },
      {
        "type": "rich_text_section",
        "elements": [
          {
            "type": "text",
            "text": "\n"
          }
        ]
      },
      {
        "type": "rich_text_preformatted",
        "elements": [
          {
            "type": "text",
            "text": "This is a\nmulti-line \ncode block"
          }
        ],
        "border": 1
      },
      {
        "type": "rich_text_section",
        "elements": [
          {
            "type": "text",
            "text": "\nThis is a "
          },
          {
            "type": "link",
            "url": "https://www.google.com/",
            "text": "link"
          },
          {
            "type": "text",
            "text": " to google.\n\n"
          }
        ]
      },
      {
        "type": "rich_text_list",
        "elements": [
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": "We should also support nested styling like this bolded text",
                "style": {
                  "bold": true
                }
              }
            ]
          },
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": "in an unordered list",
                "style": {
                  "bold": true
                }
              }
            ]
          },
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": "on a text quote.",
                "style": {
                  "bold": true
                }
              }
            ]
          }
        ],
        "style": "bullet",
        "indent": 0,
        "border": 1
      },
      {
        "type": "rich_text_section",
        "elements": [
          {
            "type": "text",
            "text": "Or this "
          },
          {
            "type": "text",
            "text": "bolded",
            "style": {
              "bold": true,
              "code": true
            }
          },
          {
            "type": "text",
            "text": " code",
            "style": {
              "code": true
            }
          },
          {
            "type": "text",
            "text": ".\n\n\n\nAnd preserve whitespace/newlines?"
          }
        ]
      }
    ]
  },
  {
    "type": "rich_text",
    "block_id": "9xF+h",
    "elements": [
      {
        "type": "rich_text_section",
        "elements": [
          {
            "type": "emoji",
            "name": "couple_with_heart",
            "skin_tone": 2,
            "unicode": "1f9d1-1f3fc-200d-2764-fe0f-200d-1f9d1-1f3fe"
          },
          {
            "type": "emoji",
            "name": "+1"
          },
          {
            "type": "emoji",
            "name": "thumbsup"
          },
          {
            "type": "user",
            "user_id": "U3TEST",
            "style": {
              "bold": true,
              "italic": true,
              "strike": true
            }
          },
          {
            "type": "text",
            "text": " hello man "
          },
          {
            "type": "link",
            "url": "http://hi.com",
            "text": "hello world"
          },
          {
            "type": "text",
            "text": " "
          },
          {
            "type": "link",
            "url": "http://hi.com",
            "text": "hi.com"
          },
          {
            "type": "text",
            "text": " "
          },
          {
            "type": "broadcast",
            "range": "here"
          },
          {
            "type": "text",
            "text": " hi everyone "
          },
          {
            "type": "broadcast",
            "range": "channel"
          },
          {
            "type": "text",
            "text": " hello everyone "
          },
          {
            "type": "broadcast",
            "range": "everyone"
          },
          {
            "type": "text",
            "text": " hejj"
          },
          {
            "type": "text",
            "text": "This is a rich text section with regular text. "
          },
          {
            "type": "text",
            "text": "This is bold",
            "style": {
              "bold": true
            }
          },
          {
            "type": "text",
            "text": ". "
          },
          {
            "type": "text",
            "text": "This is italics.",
            "style": {
              "italic": true
            }
          },
          {
            "type": "text",
            "text": " ",
            "style": {
              "bold": true,
              "italic": true
            }
          },
          {
            "type": "text",
            "text": "This is strikethrough.",
            "style": {
              "strike": true
            }
          },
          {
            "type": "text",
            "text": " "
          },
          {
            "type": "text",
            "text": "This is code.",
            "style": {
              "code": true
            }
          }
        ]
      }
    ]
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "Hellow world\nhello world\n\nhellow orld <@U1TEST> and <@U2TEST> have been recognized for *:busts_in_silhouette: Collaborates Radically* by <@U3TEST> on <#C1TEST> and <!subteam^SAZ94GDB8> and <#general> @here @everyone @channel @hello _this is italic_ and _~this is strikethrough~_\nThis is a like break, ~another strikethrough~ and this is is `inline **code**` okay cool ```This is a code block\nAnd it's multi-line``` now here is the list \n- Detective Chimp\n- Bouncing Boy \n\n\n- Aqualad hello dot. \n<http://www.example.com|This message *is* a link> Hello _*<!date^1392734382^Posted {date_short} {time_secs}^https://youtube.com|Posted 2014-02-18 6:39:42 AM PST>*_ hello :heart: :ok_hand::skin-tone-2:"
    }
  }
]
}

export const FIXTURES: Fixture[] = [
  welcome,
  richText,
  sectionWithFields,
  interactive,
  image,
  markdownTable,
  inputs,
  large,
  ...(slackGalleryTemplates as Fixture[]),
  ...(slackTemplates as Fixture[]),
];
