import React from 'react';

type ErrProps = { message: React.ReactNode };
const Error = ({ message }: ErrProps) => {
  return (
    <section className="error">{message}</section>
  )
}

export default Error;
