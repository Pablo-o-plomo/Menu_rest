'use client';
import { useEffect, useState } from 'react';

type R={id:string;name:string;city:string;isActive:boolean};
export default function Restaurants(){
  const [rows,setRows]=useState<R[]>([]);const [form,setForm]=useState({name:'',city:''});
  async function load(){setRows(await (await fetch('/api/restaurants')).json());}
  useEffect(()=>{load();},[]);
  async function create(){await fetch('/api/restaurants',{method:'POST',body:JSON.stringify({...form,isActive:true})});setForm({name:'',city:''});load();}
  async function toggle(r:R){await fetch('/api/restaurants',{method:'PATCH',body:JSON.stringify({...r,isActive:!r.isActive})});load();}
  return <div><h1>Рестораны</h1><div className='card'><div className='toolbar'><input className='input' placeholder='Название' value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input className='input' placeholder='Город' value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/><button className='btn' onClick={create}>Создать</button></div></div><table className='table'><thead><tr><th>Название</th><th>Город</th><th>Статус</th><th/></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{r.name}</td><td>{r.city}</td><td><span className={`badge ${r.isActive?'ok':'bad'}`}>{r.isActive?'Вкл':'Выкл'}</span></td><td><button className='btn secondary' onClick={()=>toggle(r)}>{r.isActive?'Выключить':'Включить'}</button></td></tr>)}</tbody></table></div>;
}
