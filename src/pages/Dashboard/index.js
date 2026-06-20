import {useEffect, useState} from 'react'

import Cookies from 'js-cookie'

import Navbar from '../../components/Navbar'

import {useNavigate} from 'react-router-dom'

import {
  formatDate,
  formatCurrency,
} from '../../utils/helpers'

import {
  FaDollarSign,
  FaPercentage,
  FaUsers,
} from 'react-icons/fa'

import {
  MdCreditCard,
  MdOutlineSwapHoriz,
} from 'react-icons/md'

import {
  HiOutlineLink,
} from 'react-icons/hi'

import {
  BsHourglassSplit,
  BsCoin,
} from 'react-icons/bs'

import './index.css'

const apiUrl = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  const [isReferralsLoading, setIsReferralsLoading] = useState(false)

  const [errorMsg, setErrorMsg] = useState('')

  const [searchInput, setSearchInput] = useState('')

  const [sortOrder, setSortOrder] = useState('desc')

  const [currentPage, setCurrentPage] = useState(1)

  const navigate = useNavigate()

  useEffect(() => {
    getDashboardData(
      '',
      'desc',
      true,
    )
  }, [])

  useEffect(() => {
    getDashboardData(
      searchInput,
      sortOrder,
      false,
    )
  }, [searchInput, sortOrder])

  const getDashboardData = async (search = '',sort = 'desc',isInitialLoad = false,) => {
    if (isInitialLoad) {
      setIsLoading(true)
    } else {
      setIsReferralsLoading(true)
    }

    const token = Cookies.get('jwt_token')

    const apiRequestUrl = `${apiUrl}?search=${search}&sort=${sort}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await fetch(
      apiRequestUrl,
      options,
    )

    const responseData =
      await response.json()

    if (response.ok) {
      const data =
        responseData.data || responseData

      setDashboardData(data)

      setErrorMsg('')
    } else {
      setErrorMsg(
        responseData.message ||
          'Something went wrong',
      )
    }

    if (isInitialLoad) {
      setIsLoading(false)
    } else {
      setIsReferralsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <Navbar />

        <div className="loading-container">
          <p>Loading...</p>
        </div>
      </>
    )
  }

  if (errorMsg !== '') {
    return (
      <>
        <Navbar />

        <div
          className="error-container"
          role="alert"
        >
          <p>{errorMsg}</p>
        </div>
      </>
    )
  }

  const {
    metrics,
    serviceSummary,
  } = dashboardData

  const referrals = dashboardData.referrals || []

  const itemsPerPage = 10

  const totalPages = Math.max(1,
    Math.ceil(
      referrals.length / itemsPerPage,
    ),
  )

  const startIndex = (currentPage - 1) * itemsPerPage

  const endIndex = startIndex + itemsPerPage

  const currentReferrals =
    referrals.slice(
      startIndex,
      endIndex,
    )

  const metricIcons = [
    <FaDollarSign />,
    <MdCreditCard />,
    <HiOutlineLink />,
    <BsHourglassSplit />,
    <FaPercentage />,
    <BsCoin />,
    <FaUsers />,
    <MdOutlineSwapHoriz />,
  ]

  return (
    <>
      <Navbar />

      <div className="dashboard-bg-container">
        <div className="dashboard-content">
          <h1 className="dashboard-heading">
            Referral Dashboard
          </h1>

          <p className="dashboard-description">
            Track your referrals, earnings, and partner
            activity in one place.
          </p>

          <section className="dashboard-section">
            <h2 className="section-heading">
              Overview
            </h2>

            <div className="metrics-container">
              {metrics.map((eachMetric, index) => (
                <div
                  key={eachMetric.id}
                  className="metric-card"
                >
                  <div className="metric-icon">
                    {metricIcons[index]}
                  </div>

                  <h3 className="metric-value">
                    {eachMetric.value}
                  </h3>

                  <p className="metric-label">
                    {eachMetric.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="dashboard-section">
            <h2 className="section-heading">
              Service summary
            </h2>

            <div className="service-summary-grid">
              <div className="summary-card">
                <p className="summary-label">
                  Service
                </p>

                <h4 className="summary-value service-name">
                  {serviceSummary.service}
                </h4>
              </div>

              <div className="summary-card">
                <p className="summary-label">
                  Your Referrals
                </p>

                <h4 className="summary-value">
                  {serviceSummary.yourReferrals}
                </h4>
              </div>

              <div className="summary-card">
                <p className="summary-label">
                  Active Referrals
                </p>

                <h4 className="summary-value">
                  {serviceSummary.activeReferrals}
                </h4>
              </div>

              <div className="summary-card">
                <p className="summary-label">
                  Total Ref. Earnings
                </p>

                <h4 className="summary-value">
                  {serviceSummary.totalRefEarnings}
                </h4>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <h2 className="section-heading">
              Refer friends and earn more
            </h2>

            <div className="share-grid">
              <div className="share-item">
                <p className="share-label">
                  YOUR REFERRAL LINK
                </p>

                <div className="share-field-container">
                  <input
                    readOnly
                    value={
                      dashboardData.referral.link
                    }
                    className="share-input"
                  />

                  <button
                    type="button"
                    className="copy-btn"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="share-item">
                <p className="share-label">
                  YOUR REFERRAL CODE
                </p>

                <div className="share-field-container">
                  <input
                    readOnly
                    value={
                      dashboardData.referral.code
                    }
                    className="share-input"
                  />

                  <button
                    type="button"
                    className="copy-btn"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <h2 className="section-heading">
              All referrals
            </h2>

            <div className="table-controls">
              <input
                type="search"
                placeholder="Name or service…"
                className="search-input"
                value={searchInput}
                onChange={event => {
                  setCurrentPage(1)

                  setSearchInput(
                    event.target.value,
                  )
                }}
              />

              <div className="sort-container">
                <label htmlFor="sort">
                  Sort by date
                </label>

                <select
                  id="sort"
                  value={sortOrder}
                  onChange={event => {
                    setCurrentPage(1)

                    setSortOrder(
                      event.target.value,
                    )
                  }}
                >
                  <option value="desc">
                    Newest first
                  </option>

                  <option value="asc">
                    Oldest first
                  </option>
                </select>
              </div>
            </div>

            <table className="referrals-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Profit</th>
                </tr>
              </thead>

              <tbody>
                {isReferralsLoading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="table-loading"
                    >
                      Loading referrals...
                    </td>
                  </tr>
                ) : currentReferrals.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      No matching entries
                    </td>
                  </tr>
                ) : (
                  currentReferrals.map(referral => (
                    <tr
                      key={referral.id}
                      className="table-row"
                      onClick={() =>
                        navigate(`/referral/${referral.id}`)
                      }
                    >
                      <td>{referral.name}</td>

                      <td>{referral.serviceName}</td>

                      <td>
                        {formatDate(referral.date)}
                      </td>

                      <td className="profit-cell">
                        {formatCurrency(referral.profit)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="pagination-container">
              <p className="entries-text">
                Showing {startIndex + 1}–
                {Math.min(
                  endIndex,
                  referrals.length,
                )}{' '}
                of {referrals.length} entries
              </p>

              <div className="pagination-buttons">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage(
                      prev => prev - 1,
                    )
                  }
                >
                  Previous
                </button>

                {[...Array(totalPages)].map(
                  (_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={
                        currentPage ===
                        index + 1
                          ? 'active-page'
                          : ''
                      }
                      onClick={() =>
                        setCurrentPage(
                          index + 1,
                        )
                      }
                    >
                      {index + 1}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      prev => prev + 1,
                    )
                  }
                >
                  Next
                </button>
              </div>
            </div>

          </section>

        </div>
      </div>
      <footer className="footer">
            <p className="footer-brand">
              Go Business
            </p>

            <div className="footer-links">
              <a href="/">About</a>

              <a href="/">Contact</a>

              <a href="/">Privacy</a>

              <a href="/">Terms</a>
            </div>

            <p className="footer-copy">
              © 2024 Go Business
            </p>
          </footer>
    </>
  )
}

export default Dashboard