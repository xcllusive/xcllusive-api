import httpStatus from 'http-status'
import APIError from '../utils/APIError'

export default (sequelize, DataTypes) => {
  const Business = sequelize.define('Business', {
    businessID: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: false,
        notNull: true
      }
    },
    businessCat: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    commissionPerc: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    commissionSold: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    conclusionDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    listed: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    active: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    address1V: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    address2V: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    afterSalesNotes: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    businessABN: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    businessCategoryText: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    businessDescriptionShort: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    businessNameLabel: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    businessNameSecondary: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    businessNameSecondarySel: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    businessPartner: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true
      }
    },
    businessSource: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    businessType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    businessURL: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    cCreatedBy: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    chartSelScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    cModifiedBy: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    countAttBuyers: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    countTaskDueNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    creationDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    currentPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    data120DayGuarantee: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    dataRegion: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    dateChangedToForSale: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dateChangedToSalesMemorandum: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dayGeneratedIWP: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    displayNameV: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    firstNameV: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    forSale: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    fullnameV: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    gDateFrom: {
      type: DataTypes.DATE,
      allowNull: false
    },
    gDateto: {
      type: DataTypes.DATE,
      allowNull: false
    },
    gGlobalPending: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    idReferrer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    imNote: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    imRegenerate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    imStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    imVersion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    introducerType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    listedPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    listingAgent: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    listingAgentEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    locationFormat: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lostDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    lostDateCopy: {
      type: DataTypes.DATE,
      allowNull: false
    },
    mailingAddressV: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    modificationBy: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    modificationDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    notifyOwner: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    ownersTime: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    postCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    postCodeV: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    potentialListing: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    recID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    referralList: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    referrerComAgreed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    referrerComSold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    saleNotesLostMeeting: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    saleNotesLostWant: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    saleNotesReasonChoose: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    saleNotesReasonType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    searchNote: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    sellabilityCounter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    sellabilityLockout: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    sellabilityStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    settlementDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    sold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    soldAgentCalc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    soldCalc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    soldCalcDisplay: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    soldDataCheck: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    soldOwnerCalc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    soldPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    soldStockPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    sort: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    sortBy: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    sourceNotes: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    staffAccountName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    stage: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    statsLeadNurtureStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    suburb: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    suburbV: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    surnameV: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    underOffer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    uVendorPhone1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    vendorEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    vendorFax: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    vendorFaxAC: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    vendorPhone1: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    vendorPhone1AC: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    vendorPhone2: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    vendorPhone3: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    wCreatedBy: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    webStage: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    withdrawn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    withdrawnCalc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    wModifiedBy: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    }
  }, {
    createdAt: 'dateTimeCreated',
    updatedAt: 'dateTimeModified'    
  })

  return Business
}
