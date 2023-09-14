<p align="center">
  <img src="https://cdn.discordapp.com/attachments/1097559597268619425/1151740733032771634/logo.png" alt="Party Hat Logo">
</p>

## Overview

**Party Hat** is a web application that allows you to easily upload files or provide URLs to upload files to a server. It provides a simple and user-friendly interface for uploading, storing, and sharing files. Whether you want to share images, documents, or any other file type, **Party Hat** has got you covered.

## Features
- **Easy File Upload:** Upload files quickly and easily using the intuitive user interface.
- **URL Upload:** Share files by providing direct URLs to the file you want to upload.
- **File Size Limit:** Party Hat supports files up to 500 MB in size, making it suitable for a wide range of use cases.
- **File Type Restrictions:** Certain file types, such as executable files, are restricted for security reasons.
- **Copy to Clipboard:** Click on the file link to copy it to your clipboard for easy sharing.
- **Server-Side Backend:** The server handles file uploads and serves files, ensuring a seamless experience.
- **Lightweight and Fast:** Party Hat is designed to be lightweight and efficient, ensuring fast performance.
- **Client Deployment:** The client application can be easily deployed to any HTTP server or hosting platform, such as Vercel.

## Getting Started

### Prerequisites

Before you get started, ensure you have the following dependencies:

- Node.js
- npm (Node Package Manager)

### API Setup

1. Clone the repository:

   ```shell
   git clone https://github.com/workclocks/partyhat.git
    ```
2. Navigate to the project directory:

   ```shell
   cd partyhat
   ```
3. Install the dependencies:

   ```shell
   cd src/server
   npm install
    ```
4. Start the API server:

   ```shell
   npm start
   ```
5. **Congrats!** The API server should now be running on port 8080.

### Client Setup
The Party Hat client is a static web application, which means it can be deployed on any HTTP server or platform that serves static files. You have a couple of deployment options:

1. **Local Hosting:** If you want to run Party Hat locally for development purposes, you can simply open the `src/web/index.html` file in your web browser. No additional setup is required.

2. **Online Deployment:** You can deploy the Party Hat client to online platforms like [Vercel](https://vercel.com/) for easy access. Just upload the contents of the `src/web` directory to your chosen hosting service, and your Party Hat instance will be live.

## Usage
- To upload a file, drag and drop it into the designated area or click to select files.
- To upload a file via URL, click the "Upload via URL" button, paste the URL, and click "Start."
- Uploaded files will be processed and assigned unique links.
- Click on a link to access and share the uploaded file.
- You can also copy the link to the clipboard or open it in a new tab.

## Contributors
- workclocks (Walnut)
    - [GitHub](https://github.com/workclocks)
    - [Discord](https://discordapp.com/users/498665680233824271)
- Want to contribute? Feel free to submit a pull request!

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
