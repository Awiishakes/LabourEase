import { useTranslation } from "react-i18next"

const UrduFont = (props) => {
    const { i18n } = useTranslation()
    const isUrdu = i18n.language === 'ur'
  return (
    <span className={isUrdu?'font-ur':''}>{props.children}</span>
  )
}

export default UrduFont
