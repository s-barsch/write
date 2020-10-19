import React from 'react';

type ErrProps = { message: string };
const Error = ({ message }: ErrProps) => {
  return (
    <section className="error">{message}</section>
  )
}

export default Error;
