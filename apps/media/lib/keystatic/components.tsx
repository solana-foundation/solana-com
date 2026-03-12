import { fields } from "@keystatic/core";
import {
  block,
  wrapper,
  type ContentComponent,
} from "@keystatic/core/content-components";
import React from "react";

// Background options for section blocks
const backgroundOptions = [
  { label: "Default", value: "bg-default" },
  { label: "White", value: "bg-white/80" },
  { label: "Gray", value: "bg-gray-50/80" },
  { label: "Zinc", value: "bg-zinc-50" },
  { label: "Black", value: "bg-black/80" },
  { label: "Red", value: "bg-red-50/80" },
  { label: "Orange", value: "bg-orange-50/80" },
  { label: "Yellow", value: "bg-yellow-50/80" },
  { label: "Green", value: "bg-green-50/80" },
  { label: "Lime", value: "bg-lime-50/80" },
  { label: "Emerald", value: "bg-emerald-50/80" },
  { label: "Teal", value: "bg-teal-50/80" },
  { label: "Cyan", value: "bg-cyan-50/80" },
  { label: "Blue", value: "bg-blue-50/80" },
  { label: "Sky", value: "bg-sky-50/80" },
  { label: "Indigo", value: "bg-indigo-50/80" },
  { label: "Violet", value: "bg-violet-50/80" },
  { label: "Purple", value: "bg-purple-50/80" },
  { label: "Fuchsia", value: "bg-fuchsia-50/80" },
  { label: "Pink", value: "bg-pink-50/80" },
  { label: "Rose", value: "bg-rose-50/80" },
] as const;

// Block Quote component - wrapper because it has children
const blockquote = wrapper({
  label: "Block Quote",
  description: "A styled quote block with optional author attribution",
  schema: {
    authorName: fields.text({ label: "Author" }),
  },
  ContentView: (props) => (
    <div
      style={{
        borderLeft: "4px solid #6366f1",
        paddingLeft: "16px",
        margin: "16px 0",
        fontStyle: "italic",
      }}
    >
      {props.children}
      {props.value.authorName && (
        <p style={{ marginTop: "8px", fontWeight: "bold" }}>
          — {props.value.authorName}
        </p>
      )}
    </div>
  ),
});

// DateTime component - block (no children)
const datetime = block({
  label: "Date & Time",
  description: "Display the current date/time in different formats",
  schema: {
    format: fields.select({
      label: "Format",
      options: [
        { label: "UTC", value: "utc" },
        { label: "ISO", value: "iso" },
        { label: "Local", value: "local" },
      ],
      defaultValue: "utc",
    }),
  },
  ContentView: (props) => (
    <span
      style={{
        backgroundColor: "#f3f4f6",
        padding: "2px 6px",
        borderRadius: "4px",
        fontFamily: "monospace",
      }}
    >
      [DateTime: {props.value.format}]
    </span>
  ),
});

// Newsletter Signup component - wrapper because it has content children
const newslettersignup = wrapper({
  label: "Newsletter Sign Up",
  description: "Email signup form for newsletters",
  schema: {
    placeholder: fields.text({
      label: "Placeholder",
      defaultValue: "Enter your email",
    }),
    buttonText: fields.text({
      label: "Button Text",
      defaultValue: "Notify Me",
    }),
  },
  ContentView: (props) => (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "16px",
        margin: "16px 0",
        backgroundColor: "#f9fafb",
      }}
    >
      {props.children}
      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        <input
          type="email"
          placeholder={props.value.placeholder}
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "4px",
          }}
          disabled
        />
        <button
          style={{
            padding: "8px 16px",
            backgroundColor: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
          disabled
        >
          {props.value.buttonText}
        </button>
      </div>
    </div>
  ),
});

// Video component - block (no children)
const video = block({
  label: "Video",
  description: "Embedded video player",
  schema: {
    background: fields.select({
      label: "Background",
      options: backgroundOptions,
      defaultValue: "bg-default",
    }),
    color: fields.select({
      label: "Color",
      options: [
        { label: "Default", value: "default" },
        { label: "Tint", value: "tint" },
        { label: "Primary", value: "primary" },
      ],
      defaultValue: "default",
    }),
    url: fields.text({
      label: "URL",
      description: "YouTube, Vimeo, or other video URL",
    }),
    autoPlay: fields.checkbox({ label: "Auto Play" }),
    loop: fields.checkbox({ label: "Loop" }),
    controls: fields.checkbox({ label: "Controls", defaultValue: true }),
    muted: fields.checkbox({ label: "Muted" }),
  },
  ContentView: (props) => (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "16px",
        margin: "16px 0",
        backgroundColor: "#f9fafb",
        textAlign: "center",
      }}
    >
      <p style={{ margin: 0, fontWeight: "bold" }}>Video Block</p>
      {props.value.url && (
        <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#6b7280" }}>
          {props.value.url}
        </p>
      )}
    </div>
  ),
});

// Gallery component - block (no children)
const gallery = block({
  label: "Gallery",
  description: "Image gallery with optional captions",
  schema: {
    background: fields.select({
      label: "Background",
      options: backgroundOptions,
      defaultValue: "bg-default",
    }),
    images: fields.array(
      fields.object({
        heading: fields.text({ label: "Heading" }),
        body: fields.text({ label: "Body" }),
        button: fields.object(
          {
            label: fields.text({ label: "Label" }),
            type: fields.select({
              label: "Type",
              options: [
                { label: "Default", value: "default" },
                { label: "Link", value: "link" },
              ],
              defaultValue: "default",
            }),
            link: fields.text({ label: "Link" }),
          },
          { label: "Button" }
        ),
        size: fields.select({
          label: "Size",
          options: [
            { label: "Small", value: "small" },
            { label: "Large", value: "large" },
            { label: "Skinny", value: "skinny" },
          ],
          defaultValue: "small",
        }),
        image: fields.object(
          {
            src: fields.image({
              label: "Image Source",
              directory: "public/uploads/posts",
              publicPath: "/uploads/posts",
            }),
            alt: fields.text({ label: "Alt Text" }),
          },
          { label: "Image" }
        ),
        square: fields.checkbox({ label: "Square" }),
      }),
      {
        label: "Images",
        itemLabel: (props) => props.fields.heading.value || "Gallery Image",
      }
    ),
  },
  ContentView: (props) => (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "16px",
        margin: "16px 0",
        backgroundColor: "#f9fafb",
      }}
    >
      <p style={{ margin: 0, fontWeight: "bold" }}>Gallery Block</p>
      <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#6b7280" }}>
        {props.value.images?.length || 0} images
      </p>
    </div>
  ),
});

// Stats component - block (no children)
const stats = block({
  label: "Stats",
  description: "Display statistics with title and description",
  schema: {
    background: fields.select({
      label: "Background",
      options: backgroundOptions,
      defaultValue: "bg-default",
    }),
    title: fields.text({ label: "Title" }),
    description: fields.text({ label: "Description" }),
    stats: fields.array(
      fields.object({
        stat: fields.text({ label: "Stat" }),
        type: fields.text({ label: "Type" }),
      }),
      {
        label: "Stats",
        itemLabel: (props) =>
          `${props.fields.stat.value} ${props.fields.type.value}`,
      }
    ),
  },
  ContentView: (props) => (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "16px",
        margin: "16px 0",
        backgroundColor: "#f9fafb",
      }}
    >
      <p style={{ margin: 0, fontWeight: "bold" }}>
        {props.value.title || "Stats Block"}
      </p>
      <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#6b7280" }}>
        {props.value.stats?.length || 0} statistics
      </p>
    </div>
  ),
});

// Footnotes component - block (no children)
const footnotes = block({
  label: "Footnotes",
  description: "Add footnote references",
  schema: {
    footnotes: fields.text({ label: "Footnotes" }),
  },
  ContentView: (props) => (
    <div
      style={{
        borderTop: "1px solid #e5e7eb",
        paddingTop: "16px",
        marginTop: "32px",
        fontSize: "14px",
        color: "#6b7280",
      }}
    >
      <p style={{ margin: 0, fontWeight: "bold" }}>Footnotes</p>
      {props.value.footnotes && (
        <p style={{ margin: "8px 0 0" }}>{props.value.footnotes}</p>
      )}
    </div>
  ),
});

// Superscript component - wrapper because it has text children
const sup = wrapper({
  label: "Superscript",
  description: "Superscript text for footnote references",
  schema: {},
  ContentView: (props) => (
    <sup
      style={{
        fontSize: "0.75em",
        verticalAlign: "super",
        color: "#6366f1",
      }}
    >
      {props.children}
    </sup>
  ),
});

// Tweet embed component - block (no children)
const tweet = block({
  label: "Tweet",
  description: "Embed a tweet/X post",
  schema: {
    id: fields.text({
      label: "Tweet ID",
      description: "The ID of the tweet to embed",
    }),
  },
  ContentView: (props) => (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "16px",
        margin: "16px 0",
        backgroundColor: "#f9fafb",
        textAlign: "center",
      }}
    >
      <p style={{ margin: 0, fontWeight: "bold" }}>Tweet Embed</p>
      {props.value.id && (
        <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#6b7280" }}>
          ID: {props.value.id}
        </p>
      )}
    </div>
  ),
});

// Iframe embed component - block (no children)
const iframe = block({
  label: "Iframe Embed",
  description: "Embed external content via iframe",
  schema: {
    src: fields.text({ label: "Source URL" }),
    width: fields.text({ label: "Width" }),
    height: fields.text({ label: "Height" }),
    allow: fields.text({ label: "Allow Attributes" }),
  },
  ContentView: (props) => (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "16px",
        margin: "16px 0",
        backgroundColor: "#f9fafb",
        textAlign: "center",
      }}
    >
      <p style={{ margin: 0, fontWeight: "bold" }}>Iframe Embed</p>
      {props.value.src && (
        <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#6b7280" }}>
          {props.value.src}
        </p>
      )}
    </div>
  ),
});

// Export all component blocks
export const componentBlocks: Record<string, ContentComponent> = {
  blockquote,
  datetime,
  newslettersignup,
  video,
  gallery,
  stats,
  footnotes,
  sup,
  tweet,
  iframe,
};

// Export fields for rendering configuration
export { fields } from "@keystatic/core";
