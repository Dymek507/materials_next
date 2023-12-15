import React from 'react'

import CsvDownloadButton from 'react-json-to-csv'
import { dataToExport } from '../../utils/dataToExport'
import GridOnIcon from '@mui/icons-material/GridOn';
import Link from 'next/link'
import { ICompanywithDistance } from './helpers/types';
import { Checkbox, IconButton, Slider } from '@mui/material'
import { ICategory } from '@/src/types/model';

type MenuProps = {
  companyListFiltered: ICompanywithDistance[]
  openAddModalHandler: () => void
  openImportModalHandler: () => void
  setRadiusHandler: (radius: number) => void
  categories: ICategory[] | undefined
  checkboxHandler: (key: string) => void
  category: string
}

const Menu = ({ companyListFiltered, openAddModalHandler, openImportModalHandler, setRadiusHandler, categories, checkboxHandler, category }: MenuProps) => {

  const valuetext = (value: number) => {
    return `${value}`;
  }

  return (
    <div>      <div className='absolute top-40 bg-slate-300 w-72 h-[600px] z-[999] p-4 ml-4  '>
      <CsvDownloadButton data={dataToExport(companyListFiltered)} className='text-black' >
        Export
      </CsvDownloadButton>
      <Link href='/table' >
        <button className='ml-4 text-black'>Tabela</button>
      </Link>
      <button onClick={openAddModalHandler} className='ml-4 text-black'>Dodaj</button>
      <IconButton onClick={openImportModalHandler} sx={{ ml: '1rem' }}>
        <GridOnIcon />
      </IconButton>
      <Slider
        aria-label="Temperature"
        defaultValue={0}
        getAriaValueText={valuetext}
        onChange={e => {
          const radius = e.target as HTMLInputElement
          const value = Number(radius.value)
          setRadiusHandler(value)
        }
        }
        valueLabelDisplay="auto"
        step={50}
        marks
        min={0}
        max={350}
      />
      <ul className='flex flex-col gap-2 h-[500px] overflow-y-scroll text-black'>
        {categories && categories.map((item) => (
          <li key={item.key} ><Checkbox onChange={() => checkboxHandler(item.key)} checked={item.key == category} />{item.name}</li>
        ))
        }
      </ul>
    </div></div>
  )
}

export default Menu