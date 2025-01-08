import { LoaderFunctionArgs } from '@remix-run/node';
import { Form, json, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import type { FunctionComponent } from 'react';
import { getContact } from '../data';
import type { ContactRecord } from '../data';

// Loader関数: サーバーからデータを取得
export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, 'Missing contactId param');
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ contact });
};

// Reactコンポーネント: Contact
export default function Contact() {
  const { contact } = useLoaderData<typeof loader>();

  // contactが存在しない場合に対処
  if (!contact) {
    return (
      <div id='contact'>
        <p>Contact not found.</p>
      </div>
    );
  }

  return (
    <div id='contact'>
      <div>
        <img
          alt={`${contact.first} ${contact.last} avatar`}
          src={contact.avatar}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{' '}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a href={`https://twitter.com/${contact.twitter}`}>
              @{contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action='edit'>
            <button type='submit'>Edit</button>
          </Form>

          <Form
            action='destroy'
            method='post'
            onSubmit={(event) => {
              const response = confirm(
                'Please confirm you want to delete this record.'
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type='submit'>Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

// Reactコンポーネント: Favorite
const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, 'favorite'>;
}> = ({ contact }) => {
  const favorite = contact.favorite;

  return (
    <Form method='post'>
      <button
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        name='favorite'
        value={favorite ? 'false' : 'true'}
      >
        {favorite ? '★' : '☆'}
      </button>
    </Form>
  );
};
