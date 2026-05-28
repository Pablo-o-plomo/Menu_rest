'use client';
import { useEffect, useState } from 'react';

export default function PricesUpload(){
  const [restaurants,setR]=useState<any[]>([]);
  const [rid,setRid]=useState('');
  const [preview,setP]=useState<any>(null);
  const [snapshotDate,setD]=useState('');
  const [comment,setC]=useState('');

  useEffect(()=>{fetch('/api/restaurants').then(r=>r.json()).then(setR)},[]);

  async function prev(e:any){
    e.preventDefault();
    const fd=new FormData();
    fd.append('file',e.target.file.files[0]);
    const r=await fetch('/api/uploads/prices/preview',{method:'POST',body:fd});
    setP(await r.json());
  }

  async function confirm(){
    await fetch('/api/uploads/prices/confirm',{method:'POST',body:JSON.stringify({...preview,restaurantId:rid,snapshotDate,comment})});
    alert('Импорт цен завершен');
  }

  return <div><h1>Загрузка сводного прейскуранта iiko/Aiko</h1>
    <div className='card'>
      <div className='toolbar'>
        <select className='select' value={rid} onChange={e=>setRid(e.target.value)}><option value=''>Ресторан</option>{restaurants.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select>
        <input className='input' type='date' value={snapshotDate} onChange={e=>setD(e.target.value)}/>
        <input className='input' placeholder='Комментарий' value={comment} onChange={e=>setC(e.target.value)}/>
      </div>
      <form onSubmit={prev}><input className='input' type='file' name='file' accept='.xlsx,.xls'/><button className='btn'>Предпросмотр</button></form>
    </div>

    {preview&&<div className='card'><h3>Preview</h3>{preview.errors?.map((e:string,i:number)=><div key={i} className='bad'>{e}</div>)}
      <table className='table'><thead><tr><th>Группа</th><th>Блюдо</th><th>Артикул</th><th>Цена зал</th><th>Цена доставка</th><th>Себестоимость</th><th>Наценка % зал</th><th>Наценка % доставка</th></tr></thead>
      <tbody>{preview.rows?.slice(0,100).map((r:any,i:number)=><tr key={i}><td>{r.groupName}</td><td>{r.itemName}</td><td>{r.article}</td><td>{r.hallPrice}</td><td>{r.deliveryPrice}</td><td>{r.costPrice}</td><td>{r.hallMarkupPercent}</td><td>{r.deliveryMarkupPercent}</td></tr>)}</tbody></table>
      <button className='btn' disabled={preview.critical||!rid} onClick={confirm}>Подтвердить импорт</button>
    </div>}
  </div>
}
