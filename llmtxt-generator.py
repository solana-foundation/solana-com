#!/usr/bin/env python3
"""
Script to generate LLMs.txt file by scanning all .mdx files in the content directory
"""

import os
import re
import json
from collections import defaultdict

# Base directory to scan
BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'content')
# Output file path
OUTPUT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'public', 'llms.txt')

def extract_frontmatter(file_path):
    """Extract title and description from frontmatter in .mdx files"""
    title = ""
    description = ""
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Check if file has frontmatter (between --- markers)
            frontmatter_match = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
            if frontmatter_match:
                frontmatter = frontmatter_match.group(1)
                
                # Extract title
                title_match = re.search(r'title:\s*[\'"]?(.*?)[\'"]?(\s*\n|$)', frontmatter)
                if title_match:
                    title = title_match.group(1).strip()
                
                # Extract description - improved pattern for multiline descriptions
                # First try to match descriptions in quotes
                desc_match = re.search(r'description:\s*[\'"]([^\'"]*)[\'"]', frontmatter, re.DOTALL)
                if desc_match:
                    description = desc_match.group(1).strip()
                else:
                    # Try to match multiline descriptions with indentation
                    desc_match = re.search(r'description:\s*(?:>)?\s*([^\n]*(?:\n\s+[^\n]+)*)', frontmatter)
                    if desc_match:
                        # Clean up the multiline description
                        description = re.sub(r'\n\s+', ' ', desc_match.group(1)).strip()
                    else:
                        # Last attempt - try to match any description format
                        desc_match = re.search(r'description:\s*(.*?)(?:\n[a-zA-Z]+:|$)', frontmatter, re.DOTALL)
                        if desc_match:
                            description = re.sub(r'\n\s+', ' ', desc_match.group(1)).strip()
                            # Remove quotes if they wrap the entire description
                            description = re.sub(r'^[\'"]|[\'"]$', '', description)
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
    
    return title, description.replace('\n', '')

def get_section_name(path):
    """Get a human-readable section name from a path"""
    parts = path.split(os.sep)
    
    # Skip 'content' in the path
    if 'content' in parts:
        parts = parts[parts.index('content')+1:]
    
    # Use the first two parts for the section name
    if len(parts) >= 2:
        return parts[0].capitalize() + " - " + parts[1].capitalize()
    elif len(parts) == 1:
        return parts[0].capitalize()
    else:
        return "General"

def get_relative_url(file_path):
    """Convert a file path to a relative URL for the website"""
    # Remove the base directory and file extension
    rel_path = file_path.replace(BASE_DIR, '')
    
    # Convert .mdx to appropriate URL format
    if rel_path.endswith('index.mdx'):
        rel_path = rel_path[:-9]  # Remove 'index.mdx'
    elif rel_path.endswith('.mdx'):
        rel_path = rel_path[:-4]  # Remove '.mdx'
    
    # Ensure the path starts with /
    if not rel_path.startswith('/'):
        rel_path = '/' + rel_path
    
    # Map courses to /developers path
    if '/courses/' in rel_path:
        rel_path = rel_path.replace('/courses/', '/developers/courses/')
    if '/guides/' in rel_path:
        rel_path = rel_path.replace('/guides/', '/developers/guides/')
    
    # Base URL
    base_url = "https://solana.com" + rel_path
    
    # Add UTM parameters for GA4 tracking (shorter version)
    utm_params = {
        'utm_source': 'llms',
        'utm_medium': 'ai',
        'utm_campaign': 'txt'
    }
    
    # Construct URL with UTM parameters
    tracking_url = base_url + '?' + '&'.join([f"{k}={v}" for k, v in utm_params.items()])
    
    return tracking_url

def scan_directory():
    """Scan the content directory for .mdx files and organize them by section"""
    sections = defaultdict(list)
    
    for root, _, files in os.walk(BASE_DIR):
        for file in files:
            if file.endswith('.mdx'):
                file_path = os.path.join(root, file)
                
                # Skip files in node_modules or hidden directories
                if 'node_modules' in file_path or '/.' in file_path:
                    continue
                
                # Get title and description
                title, description = extract_frontmatter(file_path)
                
                # Use filename as title if no title found
                if not title:
                    title = os.path.splitext(file)[0].replace('-', ' ').title()
                
                # Get section name
                section = get_section_name(root)
                
                # Get relative URL
                url = get_relative_url(file_path)
                
                sections[section].append({
                    'title': title,
                    'url': url,
                    'description': description
                })
    
    return sections

def check_meta_json(directory):
    """Check for meta.json files to get section information"""
    meta_path = os.path.join(directory, 'meta.json')
    if os.path.exists(meta_path):
        try:
            with open(meta_path, 'r', encoding='utf-8') as f:
                meta_data = json.load(f)
                return meta_data.get('title', ''), meta_data.get('description', '')
        except Exception as e:
            print(f"Error reading meta.json in {directory}: {e}")
    return '', ''

def generate_llms_txt(sections):
    """Generate the LLMs.txt file content"""
    content = []
    
    # Add header
    content.append("# Solana Documentation")
    content.append("")
    content.append("> Solana is the high-performance blockchain designed for mass adoption. This documentation provides comprehensive guides, references, and tutorials for developers looking to build scalable blockchain applications on Solana.")
    content.append("")
    content.append("The Solana documentation is organized into several key sections covering core concepts, client-side development, program development, and validator operations. This LLMs.txt file provides structured access to the most important documentation resources.")
    content.append("")
    
    # Add sections
    for section, pages in sorted(sections.items()):
        if pages:  # Only add sections with pages
            content.append(f"## {section}")
            content.append("")
            
            for page in sorted(pages, key=lambda x: x['title']):
                description = f": {page['description']}" if page['description'] else ""
                content.append(f"- [{page['title']}]({page['url']}){description}")
            
            content.append("")
    
    # Add optional section
    content.append("## Optional")
    content.append("")
    content.append("- [StackExchange Support](https://solana.stackexchange.com): Get help from the Solana community on StackExchange")
    content.append("- [Validator Setup](https://docs.anza.xyz/operations/setup-a-validator): Setup a validator and get connected to a cluster")
    content.append("")
    
    return "\n".join(content)

def main():
    print("Scanning content directory...")
    sections = scan_directory()
    
    print(f"Found {sum(len(pages) for pages in sections.values())} pages in {len(sections)} sections")
    
    llms_content = generate_llms_txt(sections)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(llms_content)
    
    print(f"LLMs.txt file generated at {OUTPUT_FILE}")

if __name__ == "__main__":
    main()