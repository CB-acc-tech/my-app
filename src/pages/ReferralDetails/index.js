import {useEffect, useState} from 'react'

import Cookies from 'js-cookie'

import {Link, useParams} from 'react-router-dom'

import Navbar from '../../components/Navbar'

import {
  formatDate,
  formatCurrency,
} from '../../utils/helpers'

import './index.css'

const apiUrl =
  'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals'

const ReferralDetails = () => {
  const {id} = useParams()

  const [referralData, setReferralData] =
    useState(null)

  const [isLoading, setIsLoading] =
    useState(true)

  const [errorMsg, setErrorMsg] =
    useState('')

  useEffect(() => {
    const getReferralDetails = async () => {
      setIsLoading(true)

      const token =
        Cookies.get('jwt_token')

      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await fetch(
        `${apiUrl}?id=${id}`,
        options,
      )

      const responseData = await response.json()

      console.log('Referral API Response')
      console.log(responseData)

      if (response.ok) {
    const apiData = responseData.data

    let selectedReferral = null

    if (
        apiData &&
        Array.isArray(apiData.referrals)
      ) {
        selectedReferral =
          apiData.referrals[0]
      } else {
        selectedReferral = apiData
      }

      setReferralData(
        selectedReferral,
      )
    } else {
        setErrorMsg(
          responseData.message,
        )
      }

      setIsLoading(false)
    }
    getReferralDetails()
  }, [id])

  

  if (isLoading) {
    return (
      <>
        <Navbar />

        <div className="details-status-container">
          <p>Loading...</p>
        </div>
      </>
    )
  }

  if (errorMsg !== '') {
    return (
      <>
        <Navbar />

        <div className="details-status-container">
          <p>{errorMsg}</p>
        </div>
      </>
    )
  }

  if (!referralData) {
  return (
    <>
      <Navbar />

      <div className="details-status-container">
        <h1>
          Referral not found
        </h1>
      </div>
    </>
  )
}

  

  return (
    <>
      <Navbar />

      <div className="details-bg-container">
        <div className="details-page-header">
        <Link
          to="/"
          className="back-link"
        >
          ← Back to dashboard
        </Link>

        <h1 className="details-heading">
          Referral Details
        </h1>

        <p className="details-subtitle">
          Full information for this referral partner.
        </p>
        </div>
        <div className="details-card">
          <div className="details-header">
            <h2 className="partner-name">
              {referralData.name}
            </h2>

            <span className="service-badge">
              {referralData.serviceName}
            </span>
          </div>

          <div className="detail-row">
            <p className="detail-label">
              REFERRAL ID
            </p>

            <p className="detail-value">
              {referralData.id}
            </p>
          </div>

          <div className="detail-row">
            <p className="detail-label">
              NAME
            </p>

            <p className="detail-value">
              {referralData.name}
            </p>
          </div>

          <div className="detail-row">
            <p className="detail-label">
              SERVICE NAME
            </p>

            <p className="detail-value">
              {referralData.serviceName}
            </p>
          </div>

          <div className="detail-row">
            <p className="detail-label">
              DATE
            </p>

            <p className="detail-value">
              {formatDate(referralData.date)}
            </p>
          </div>

          <div className="detail-row">
            <p className="detail-label">
              PROFIT
            </p>

            <p className="detail-value">
              {formatCurrency(referralData.profit)}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReferralDetails