export default (sequelize, DataTypes) => {
  const Business = sequelize.define(
    'Business',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
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
      address1: {
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
      businessName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      businessNameSecondary: {
        type: DataTypes.STRING,
        allowNull: true
      },
      businessType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      businessURL: {
        type: DataTypes.STRING,
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
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      firstNameV: {
        type: DataTypes.STRING,
        allowNull: false
      },
      industry: {
        type: DataTypes.STRING,
        allowNull: true
      },
      listedPrice: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      lostDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      notifyOwner: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      postCode: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      sourceNotes: {
        type: DataTypes.STRING,
        allowNull: true
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true
      },
      suburb: {
        type: DataTypes.STRING,
        allowNull: true
      },
      saleNotesLostMeeting: {
        type: DataTypes.STRING,
        allowNull: true
      },
      saleNotesLostWant: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      lastNameV: {
        type: DataTypes.STRING,
        allowNull: true
      },
      vendorEmail: {
        type: DataTypes.STRING,
        allowNull: true
      },
      vendorFax: {
        type: DataTypes.STRING,
        allowNull: true
      },
      vendorPhone1: {
        type: DataTypes.STRING,
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
      engagementFee: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      minimumCharge: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      appraisalLow: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      appraisalHigh: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      depositeTaken: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      depositeTakenDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      attachedPurchaser: {
        type: DataTypes.STRING,
        allowNull: true
      },
      settlementDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      soldPrice: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      searchNote: {
        type: DataTypes.STRING,
        allowNull: true
      },
      daysOnTheMarket: {
        type: DataTypes.DATE,
        allowNull: true
      },
      imUploaded: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      imUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      businessKnownAs: {
        type: DataTypes.STRING,
        allowNull: true
      },
      conductedAt: {
        type: DataTypes.STRING,
        allowNull: true
      },
      addLeadNurtureList: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      dateTimeAssignToAgent: {
        type: DataTypes.DATE,
        allowNull: true
      },
      dateTimeFirstOpenByAgent: {
        type: DataTypes.DATE,
        allowNull: true
      },
      agreementProperty_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
      },
      lastInvoice_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
      },
      listIssues_id: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },
      vendorPhone1Number: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
      },
      vendorPhone2Number: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
      },
      ccEmail: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      createdAt: 'dateTimeCreated',
      updatedAt: 'dateTimeModified',
      indexes: [
        {
          unique: true,
          fields: ['id']
        }
      ]
    }
  )

  Business.associate = models => {
    models.Business.belongsTo(models.User, {
      foreignKey: 'createdBy_id',
      as: 'CreatedBy'
    })
    models.Business.belongsTo(models.User, {
      foreignKey: 'modifiedBy_id',
      as: 'ModifiedBy'
    })
    models.Business.belongsTo(models.User, {
      foreignKey: 'brokerAccountName',
      as: 'AsBrokerAccountName'
    })
    models.Business.belongsTo(models.BusinessStage, {
      foreignKey: 'stageId'
    })
    models.Business.belongsTo(models.BusinessSource, {
      foreignKey: 'sourceId',
      as: 'source'
    })
    models.Business.belongsTo(models.BusinessRating, {
      foreignKey: 'ratingId'
    })
    models.Business.belongsTo(models.BusinessIndustry, {
      foreignKey: 'industryId'
    })
    models.Business.belongsTo(models.BusinessProduct, {
      foreignKey: 'productId'
    })
    models.Business.belongsTo(models.BusinessType, {
      foreignKey: 'typeId'
    })
    models.Business.belongsTo(models.BusinessStageNotSigned, {
      foreignKey: 'stageNotSignedId',
      as: 'stageNotSigned'
    })
    models.Business.belongsTo(models.BusinessStageNotWant, {
      foreignKey: 'stageNotWantId',
      as: 'stageNotWant'
    })
    models.Business.hasMany(models.BusinessLog, {
      foreignKey: 'business_id',
      as: 'BusinessLog'
    })
    models.Business.hasMany(models.EnquiryBusinessBuyer, {
      foreignKey: 'business_id'
    })
    models.Business.hasMany(models.Score, {
      foreignKey: 'business_id'
    })
    models.Business.belongsTo(models.Agreement, {
      foreignKey: 'agreement_id',
      as: 'Agreement'
    })
    models.Business.belongsTo(models.Agreement, {
      foreignKey: 'agreementProperty_id',
      as: 'AgreementProperty'
    })
    models.Business.hasMany(models.Appraisal, {
      foreignKey: 'business_id'
    })
    models.Business.belongsTo(models.User, {
      foreignKey: 'listingAgent_id',
      as: 'listingAgent'
    })
    models.Business.belongsTo(models.User, {
      foreignKey: 'listingAgentCtc_id',
      as: 'listingAgentCtc'
    })
    models.Business.hasMany(models.BrokerWeeklyReport, {
      foreignKey: 'business_id',
      as: 'BrokerWeeklyReport'
    })
    models.Business.belongsTo(models.CtcBusinessSource, {
      foreignKey: 'ctcSourceId',
      as: 'sourceCtc'
    })
    models.Business.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company'
    })
    models.Business.belongsTo(models.CtcBusinessStage, {
      foreignKey: 'ctcStageId'
    })
    models.Business.hasMany(models.BusinessSold, {
      foreignKey: 'business_id'
    })
  }

  return Business
}
