# Single-Page Email Client

Welcome to the Single-Page Email Client project! This project is a web application designed to provide users with a streamlined email experience, all within a single-page interface. Users can compose, send, receive, and manage emails seamlessly.

## Project Overview

This email client is built using Django for the backend and JavaScript, HTML, and CSS for the frontend. The application allows users to perform various email-related actions, including composing and sending emails, managing their inbox, archiving emails, replying to messages, and more.

## Getting Started

To run the Single-Page Email Client locally on your machine, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/mijwad7/mail
    ```

2. Navigate to the project directory:

    ```bash
    cd mail
    ```


3. Run the Django development server:

    ```bash
    python manage.py runserver
    ```

6. Open your web browser and visit http://localhost:8000 to access the Single-Page Email Client.

## Features

- **Compose and Send Emails**: Users can compose new emails and send them to recipients of their choice.
  
- **Manage Mailboxes**: Users can view their inbox, sent mailbox, and archived emails, with options to navigate between different mailboxes.
  
- **View Email Content**: Users can click on individual emails to view their content, including sender, recipients, subject, timestamp, and body.
  
- **Mark as Read/Unread**: Users can mark emails as read or unread, with changes reflected in real-time.
  
- **Archive and Unarchive**: Users can archive or unarchive emails, effectively organizing their inbox.
  
- **Reply to Emails**: Users can reply to received emails directly from the email view, with pre-filled recipient and subject fields.

## API Routes

The email client supports the following API routes for interacting with emails:

- **GET /emails/<mailbox>**: Retrieve a list of emails in a specific mailbox (inbox, sent, or archive).
  
- **GET /emails/<email_id>**: Retrieve details of a specific email by its ID.
  
- **POST /emails**: Send a new email with specified recipients, subject, and body.
  
- **PUT /emails/<email_id>**: Update the status of an email (e.g., mark as read/unread, archive/unarchive).
