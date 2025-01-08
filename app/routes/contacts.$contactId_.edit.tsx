import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';

import { getContact, updateContact } from '../data';

// Loader関数: 特定の連絡先を取得
export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, 'Missing contactId param');
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ contact });
};

// Action関数: フォーム送信後にデータを更新
export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.contactId, 'Missing contactId param');
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
};

// 編集フォームコンポーネント
export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();

  return (
    <Form id='contact-form' method='post'>
      <p>
        <span>Name</span>
        <input
          aria-label='First name'
          defaultValue={contact.first}
          name='first'
          placeholder='First'
          type='text'
        />
        <input
          aria-label='Last name'
          defaultValue={contact.last}
          name='last'
          placeholder='Last'
          type='text'
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          defaultValue={contact.twitter}
          name='twitter'
          placeholder='@jack'
          type='text'
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label='Avatar URL'
          defaultValue={contact.avatar}
          name='avatar'
          placeholder='https://example.com/avatar.jpg'
          type='text'
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea defaultValue={contact.notes} name='notes' rows={6} />
      </label>
      <p>
        <button type='submit'>Save</button>
        <button type='button' onClick={() => window.history.back()}>
          Cancel
        </button>
      </p>
    </Form>
  );
}