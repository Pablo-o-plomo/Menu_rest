'use client';
import { useEffect, useState } from 'react';

type R={id:string;name:string;city:string;isActive:boolean};

export default function Restaurants(){
  const [rows,setRows]=useState<R[]>([]);
  const [form,setForm]=useState({name:'',city:''});
  const [edit,setEdit]=useState<R|undefined>();
  const [msg,setMsg]=useState('');

  async function load(){setRows(await (await fetch('/api/restaurants')).json());}
  useEffect(()=>{load();},[]);

  async function create(){
    await fetch('/api/restaurants',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...form,isActive:true})});
    setForm({name:'',city:''});
    await load();
  }

  async function saveEdit(){
    if(!edit) return;
    await fetch(`/api/restaurants/${edit.id}`,{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify(edit)});
    setEdit(undefined);
    await load();
  }

  async function toggle(r:R){
    await fetch(`/api/restaurants/${r.id}`,{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({...r,isActive:!r.isActive})});
    await load();
  }

  async function remove(r:R){
    if(!confirm('Точно удалить ресторан?')) return;
    const res=await fetch(`/api/restaurants/${r.id}`,{method:'DELETE'});
    const data=await res.json();
    if(data?.message) setMsg(data.message); else setMsg('Ресторан удалён');
    await load();
  }

  return <div><h1>Рестораны</h1>
    <div className='card'><div className='toolbar'>
      <input className='input' placeholder='Название' value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <input className='input' placeholder='Город' value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/>
      <button className='btn' onClick={create}>Создать</button>
    </div>{msg&&<p>{msg}</p>}</div>

    <table className='table'><thead><tr><th>Название</th><th>Город</th><th>Статус</th><th>Действия</th></tr></thead>
      <tbody>{rows.map(r=><tr key={r.id}><td>{r.name}</td><td>{r.city}</td><td><span className={`badge ${r.isActive?'ok':'bad'}`}>{r.isActive?'Вкл':'Выкл'}</span></td><td>
        <button className='btn secondary' onClick={()=>setEdit(r)}>Редактировать</button>{' '}
        <button className='btn secondary' onClick={()=>toggle(r)}>{r.isActive?'Выключить':'Включить'}</button>{' '}
        <button className='btn secondary' onClick={()=>remove(r)}>Удалить</button>
      </td></tr>)}</tbody></table>

    {edit&&<div className='card'><h3>Редактирование</h3><div className='toolbar'>
      <input className='input' value={edit.name} onChange={e=>setEdit({...edit,name:e.target.value})}/>
      <input className='input' value={edit.city} onChange={e=>setEdit({...edit,city:e.target.value})}/>
      <select className='select' value={String(edit.isActive)} onChange={e=>setEdit({...edit,isActive:e.target.value==='true'})}><option value='true'>Активен</option><option value='false'>Не активен</option></select>
      <button className='btn' onClick={saveEdit}>Сохранить</button>
      <button className='btn secondary' onClick={()=>setEdit(undefined)}>Отмена</button>
    </div></div>}
  </div>;
}
