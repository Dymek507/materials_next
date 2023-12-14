import Link from "next/link";
import { ICompany } from "../../../types/model";

type CustomPopupProps = {
  company: ICompany;
}

const CustomPopup = ({ company }: CustomPopupProps) => {
  return (
    <div>
      <Link href={`/table/${company.id}`}>
        <p className="text-xl font-bold">
          {company.company}
        </p>
      </Link>
      <p>
        {company.adress ?? null}
      </p>
      <p>
        {company.phone ?? null}
      </p>
      <p>
        {company.mail ?? null}
      </p>
    </div >
  )
}

export default CustomPopup