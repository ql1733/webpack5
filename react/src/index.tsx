// src/index.tsx
import React from "react";
import {createRoot} from "react-dom/client";
 import './styles/index.less';
   
type Message = {
  index: number;
  title: string;
  body: string;
};
   
const sampleMessage: Message = {
  index: 1,
  title: 'sample',
  body: 'body content',
}
   
const App = () => (
  <div>
    <h1>{sampleMessage.title}</h1>
    <p>{sampleMessage.body}</p>
  </div>
);
   
const root = createRoot(document.getElementById('root'))
root.render(<App />)