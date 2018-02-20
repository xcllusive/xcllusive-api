export default (sequelize, DataTypes) => {
  const Business = sequelize.define('Business', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      allowNull: true
    },
    businessCat: {
      type: DataTypes.STRING,
      allowNull: true
    },
    commissionPerc: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    commissionSold: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    conclusionDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    listed: {
      type: DataTypes.STRING,
      allowNull: true
    },
    active: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address1V: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address2V: {
      type: DataTypes.STRING,
      allowNull: true
    },
    afterSalesNotes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    businessABN: {
      type: DataTypes.STRING,
      allowNull: true
    },
    businessCategoryText: {
      type: DataTypes.STRING,
      allowNull: true
    },
    businessDescriptionShort: {
      type: DataTypes.STRING,
      allowNull: true
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    businessNameLabel: {
      type: DataTypes.STRING,
      allowNull: true
    },
    businessNameSecondary: {
      type: DataTypes.STRING,
      allowNull: true
    },
    businessNameSecondarySel: {
      type: DataTypes.STRING,
      allowNull: true
    },
    businessPartner: {
      type: DataTypes.STRING,
      allowNull: true
    },
    businessSource: {
      type: DataTypes.STRING,
      allowNull: false
    },
    businessType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    businessURL: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cCreatedBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    chartSelScore: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cModifiedBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    countAttBuyers: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    countTaskDueNo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    creationDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    currentPrice: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    data120DayGuarantee: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dataRegion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dateChangedToForSale: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dateChangedToSalesMemorandum: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dayGeneratedIWP: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    displayNameV: {
      type: DataTypes.STRING,
      allowNull: true
    },
    firstNameV: {
      type: DataTypes.STRING,
      allowNull: false
    },
    forSale: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    gDateFrom: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gDateto: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gGlobalPending: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idReferrer: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    imNote: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imRegenerate: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    imStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imVersion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true
    },
    introducerType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    listedPrice: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    listingAgent: {
      type: DataTypes.STRING,
      allowNull: true
    },
    listingAgentEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    locationFormat: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lostDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lostDateCopy: {
      type: DataTypes.DATE,
      allowNull: true
    },
    mailingAddressV: {
      type: DataTypes.STRING,
      allowNull: true
    },
    modificationBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    modificationDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notifyOwner: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ownersTime: {
      type: DataTypes.STRING,
      allowNull: true
    },
    postCode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    postCodeV: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    potentialListing: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    recID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    referralList: {
      type: DataTypes.STRING,
      allowNull: true
    },
    referrerComAgreed: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    referrerComSold: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    saleNotesLostMeeting: {
      type: DataTypes.STRING,
      allowNull: true
    },
    saleNotesLostWant: {
      type: DataTypes.STRING,
      allowNull: true
    },
    saleNotesReasonChoose: {
      type: DataTypes.STRING,
      allowNull: true
    },
    saleNotesReasonType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    searchNote: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sellabilityCounter: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sellabilityLockout: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sellabilityStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    settlementDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sold: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    soldAgentCalc: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    soldCalc: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    soldCalcDisplay: {
      type: DataTypes.STRING,
      allowNull: true
    },
    soldDataCheck: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    soldOwnerCalc: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    soldPrice: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    soldStockPrice: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sort: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sortBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sourceNotes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    staffAccountName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    statsLeadNurtureStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    suburb: {
      type: DataTypes.STRING,
      allowNull: true
    },
    suburbV: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastNameV: {
      type: DataTypes.STRING,
      allowNull: false
    },
    underOffer: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    uVendorPhone1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    vendorEmail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    vendorFax: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vendorFaxAC: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    vendorPhone1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vendorPhone1AC: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    vendorPhone2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vendorPhone3: {
      type: DataTypes.STRING,
      allowNull: true
    },
    wCreatedBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    webStage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    withdrawn: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    withdrawnCalc: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    wModifiedBy: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    createdAt: 'dateTimeCreated',
    updatedAt: 'dateTimeModified',
    indexes: [
      {
        unique: true,
        fields: ['id']
      }
    ]
  })

  return Business
}
