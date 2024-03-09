document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_mail);


  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#view_email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function mark_read(email_id) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
}

function reply_email(email_id) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#view_email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
    document.querySelector('#compose-recipients').value = `${email.sender}`;
    const subject = email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`;
    document.querySelector('#compose-subject').value = subject;
    document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;
  });
}

function archive_mail(email_id) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  })
  load_mailbox('inbox');
}

function unarchive_mail(email_id) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  })
  load_mailbox('inbox');
}

function view_mail(email_id) {
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
    document.querySelector('#email-sender').innerHTML = `<strong>From:</strong> ${email.sender}`;
    document.querySelector('#email-recipients').innerHTML = `<strong>To:</strong> ${email.recipients.join(', ')}`;
    document.querySelector('#email-subject').innerHTML = `<strong>Subject:</strong> ${email.subject}`;
    document.querySelector('#email-timestamp').innerHTML = `<strong>Timestamp:</strong> ${email.timestamp}`;
    
    const reply_btn = document.createElement('button');
    reply_btn.innerHTML = 'Reply';
    reply_btn.classList.add('btn', 'btn-sm', 'btn-outline-primary');
    reply_btn.addEventListener('click', function() {
      reply_email(email_id)
    });
    document.querySelector('#view_email-view').append(reply_btn);

    document.querySelector('#email-body').innerHTML = email.body;

    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#view_email-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    if (!email.read) {
      mark_read(email.id);
    }


    const arch_btn = document.createElement('button');
    arch_btn.classList.add('btn', 'btn-sm', 'btn-outline-primary');
    arch_btn.style.marginTop = '150px';
    arch_btn.style.marginLeft = '-51px';
    if (!email.archived) {
      arch_btn.innerHTML = 'Archive';
      arch_btn.addEventListener('click', function() {
        archive_mail(email_id)
      });
    }
    else {
      arch_btn.innerHTML = 'Unarchive';
      arch_btn.addEventListener('click', function() {
        unarchive_mail(email_id)
      });
    } 
    document.querySelector('#view_email-view').appendChild(arch_btn);
  });
}


function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#view_email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Display the list of emails in the mailbox
    const emailsView = document.querySelector('#emails-view');

    emails.forEach(email => {
      const emailDiv = document.createElement('div');
      emailDiv.classList.add('card', 'mb-3', 'email-box');
      if (!email.read) {
        emailDiv.innerHTML = `
          <div style="cursor:pointer;" class="card-body hover d-flex justify-content-between">
          <p class="card-text"><strong>${email.sender}</strong> </p>
          <p class="card-text">${email.subject}</p>
          <p class="card-text">${email.timestamp}</p>
          </div>
          `;
      }
      else {
        emailDiv.innerHTML = `
          <div style="background-color:rgb(230, 230, 230);cursor:pointer;" class="card-body d-flex justify-content-between">
          <p class="card-text"><strong>${email.sender}</strong> </p>
          <p class="card-text">${email.subject}</p>
          <p class="card-text">${email.timestamp}</p>
          </div>
          `;
      }
      emailDiv.addEventListener('click', function(){
        view_mail(email.id)
      });
      emailsView.appendChild(emailDiv);
    });
  })
}

function send_mail(event) { 
  event.preventDefault(); 

  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body,
    }),
  })
  .then(response => response.json())
  .then(result => {
    console.log(result);
    load_mailbox('sent');
  })
}

