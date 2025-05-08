# Delegates

This repository contains information regarding Aligned Delegates active in the Sky Protocol.

## Structure

The `delegates` repo is organized as follows:

```
delegates/
├── 0x.../             # Directory named after the delegate's votedelegate address
│   ├── profile.md       # Delegate's profile information (Markdown format)
│   └── metrics.json     # Delegate's performance metrics (JSON format, previously .md)
├── ...                  # Additional delegate directories
├── templates/           # Contains templates for delegate files
│   └── delegate-template.md # Example template
├── index.json           # (Optional) An index of all delegates for quick lookup
└── README.md            # This file
```

## Components

- **Delegate Address Directories (`0x.../`)**: Each directory is named after a unique delegate's votedelegate address. It serves as a container for all information pertaining to that specific delegate.
- **`profile.md`**: Contains qualitative information about the delegate, such as their statement, platform, or contact information. Uses Markdown format for readability.
- **`metrics.json` / `metrics.md`**: Stores quantitative data related to the delegate's performance and participation. This includes voting history, proposal engagement, and other relevant metrics. Stored either as structured JSON (`.json`) or potentially as Markdown with YAML frontmatter (`.md`).
- **`templates/`**: Holds template files to ensure consistency when adding new delegates or updating existing files.
- **`index.json`**: (Optional) A JSON file that can provide a quick index or summary of all delegates listed in the directory, potentially mapping addresses to names or other key identifiers.
- **`README.md`**: Provides an overview of the `delegates` directory structure and its contents.

## Usage

To add a new delegate, create a new directory named after their address and populate it with `profile.md` and `metrics.json` (or `metrics.md`) files, using the provided templates as a starting point. Keep the information within these files updated as the delegate's status or performance changes.
