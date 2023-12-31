'use client'
import React, { useEffect, useState } from 'react'
import Map from './Map/root'
import { ICategory } from '../../types/model'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../firebase'

import CompanyForm from '../CardCompany/CompanyForm'
import InfoModal from '../../components/InfoModal/InfoModal'
import { useAppSelector } from '../../store/app/hooks'
import { getLineDistance } from '../../utils/lineDistance'

import { ICompanywithDistance } from './helpers/types'

import ImportCompaniesFromExcel from './ImportCompaniesFromExcel/root'
import Menu from './Menu'


const Locations = () => {
  const [category, setCategory] = React.useState<string>("")

  const [companyList, setCompanyList] = useState<ICompanywithDistance[]>([])

  const [companyListFiltered, setCompanyListFiltered] = useState<ICompanywithDistance[]>([])

  const [categories, setCategories] = useState<ICategory[]>()

  const [radius, setRadius] = useState<number>(0)

  const [openAddModal, setOpenAddModal] = useState<boolean>(false)

  const [openImportModal, setOpenImportModal] = useState<boolean>(false)

  const [refresh, setRefresh] = useState<boolean>(false)

  const siteCords = useAppSelector(state => state.construction.constructionSite.cords)

  //Get categories from server 

  useEffect(() => {
    const getCategories = async () => {
      const q = query(collection(db, "categories"))
      const querySnapshot = await getDocs(q);
      const newList: ICategory[] = []
      querySnapshot.forEach((doc) => {
        newList.push(doc.data() as ICategory)
      });
      setCategories(newList)
      //load default category
      setCategory(localStorage.getItem("def_category") || "")
    }
    getCategories()
  }, [])

  useEffect(() => {
    const getCompanies = async () => {
      setCompanyList([])
      const q = query(collection(db, "companies"), where("category", "array-contains", category))
      const querySnapshot = await getDocs(q);
      const newList: ICompanywithDistance[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data() as ICompanywithDistance
        data.distance = getLineDistance(data.cords, siteCords)
        newList.push(data as ICompanywithDistance)
      });
      setCompanyList(newList)
    }
    getCompanies()
    setRefresh(false)
  }, [category, refresh, siteCords])

  useEffect(() => {
    if (radius == 0) {
      return setCompanyListFiltered(companyList)
    }
    const filreredList = companyList.filter(item => item.distance <= radius)
    setCompanyListFiltered(filreredList)
  }
    , [radius, companyList, category, refresh, siteCords])


  const openAddModalHandler = () => {
    setOpenAddModal(true)
  }

  const openImportModalHandler = () => {
    setOpenImportModal(true)
  }

  const setRadiusHandler = (e: any) => {
    const radius = e.target as HTMLInputElement
    const value = Number(radius.value)
    setRadius(value)
  }

  const checkboxHandler = (category: string) => {
    setCategory(category)
    //save default category
    localStorage.setItem("def_category", category);
  }


  return (
    <div className='wh-full'>
      <InfoModal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <CompanyForm handleClose={() => setOpenAddModal(false)} getRefresh={() => setRefresh(true)} edit={false} />
      </InfoModal>
      {/* This component change navbar color */}
      <ImportCompaniesFromExcel open={openImportModal} onClose={() => setOpenImportModal(false)} />
      <Menu companyListFiltered={companyListFiltered} openAddModalHandler={openAddModalHandler} openImportModalHandler={openImportModalHandler} setRadiusHandler={setRadiusHandler} categories={categories} checkboxHandler={checkboxHandler} category={category} />
      <Map list={companyList} circleRadius={radius} />
    </div>
  )
}

export default Locations