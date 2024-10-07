import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Общие ресурсы
const commonResources = {
  en: {
    common: {
      greeting: 'Hello {{employeeId}}!',
      logout: 'Logout',
      languageSwitcher: 'Language',
      japanese: 'Japanese',
      english: 'English',
      employeeId: 'ID',
      fullName: 'Full Name',
      status: 'Status',
      present: 'Present',
      absent: 'Absent',
      table: {
        title: 'Attendance Overview',
        searchBtn: 'Search',
        searchPlaceholder: 'Search for name...',
      },
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],


      errors: {
        loginFailed: 'Login failed. Please check your credentials and try again.',
        networkError: 'Network error. Please check your internet connection and try again.',
        unauthorized: 'You are not authorized to access this page.',
        notFound: 'The requested resource was not found.',
        serverError: 'An unexpected server error occurred. Please try again later.',
        invalidInput: 'Invalid input. Please check your entries and try again.',
        sessionExpired: 'Your session has expired. Please log in again.',
      }


    },
  },
  ja: {
    common: {
      greeting: 'こんにちは {{employeeId}}!',
      logout: 'ログアウト',
      languageSwitcher: '言語',
      japanese: '日本語',
      english: '英語',
      employeeId: 'ID',
      fullName: 'フルネーム',
      status: '状態',
      present: '出席',
      absent: '欠席',
      table: {
        title: '出勤状況',
        searchBtn: '検索',
        searchPlaceholder: '氏名の検索...',
      },
      
      months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],

      errors: {
        loginFailed: 'ログインに失敗しました。認証情報を確認して再度お試しください。',
        networkError: 'ネットワークエラーが発生しました。インターネット接続を確認して再度お試しください。',
        unauthorized: 'このページにアクセスする権限がありません。',
        notFound: '要求されたリソースが見つかりません。',
        serverError: '予期せぬサーバーエラーが発生しました。後ほど再度お試しください。',
        invalidInput: '入力が無効です。入力内容を確認して再度お試しください。',
        sessionExpired: 'セッションが切れました。再度ログインしてください。',
      },
    },
  },
};

// Ресурсы пользовательской части
const userResources = {
  en: {
    user: {
      checkInTime: 'Check-in',
      checkOutTime: 'Check-out',
      totalWorkHours: 'Total Hrs',
      checkIn: 'Come',
      checkOut: 'Leave',
      statusC: {
        early_come: 'Come',
        early_leave: 'Leave',
        absent: 'Absent',
        late: 'Late',
      },
      weeklyTimesheet: {
        dateRange: {
          first: '1st-10th',
          second: '11th-20th',
          third: '21st-{{lastDay}}th',
        },
        weekdays: {
          mon: 'Mon',
          tue: 'Tue',
          wed: 'Wed',
          thu: 'Thu',
          fri: 'Fri',
          sat: 'Sat',
          sun: 'Sun',
        },
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        noData: '...',
      },
      monthSelectorModal: {
        title: 'Select Month and Year',
        year: ' ',
      },
    },
  },
  ja: {
    user: {
      checkInTime: '出勤時間',
      checkOutTime: '退勤時間',
      totalWorkHours: '総労働時間',
      checkIn: '出勤',
      checkOut: '退勤',
      statusC: {
        early_come: '早出',
        early_leave: '早退',
        absent: '欠勤',
        late: '遅刻',
      },
      weeklyTimesheet: {
        dateRange: {
          first: '1日-10日',
          second: '11日-20日',
          third: '21日-{{lastDay}}日',
        },
        weekdays: {
          mon: '月',
          tue: '火',
          wed: '水',
          thu: '木',
          fri: '金',
          sat: '土',
          sun: '日',
        },
        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        noData: '...',
      },
      monthSelectorModal: {
        title: '月と年を選択',
        year: '年',
      },
    },
  },
};

// Ресурсы административной части
const adminResources = {
  en: {
    admin: {
      // Существующие переводы...
      totalEmployee: 'Total Employees',
      onTime: 'On Time',
      absent: 'Absent',
      lateArrival: 'Late Arrival',
      earlyDepartures: 'Early Departures',
      earlyCome: 'Early Come',
      employeeId: 'ID',
      fullName: 'Full Name',
      department: 'Department',
      position: 'Position',
      workDay: 'Work Day',
      status: 'Status',
      comeTime: 'Come',
      leaveTime: 'Leave',
      totalHours: 'Total Hrs',
      barLabel: 'test',

      departmentTable: {
        departmentName: 'Departments',
        action: 'Action',
        editBtn: 'Edit',
        deleteBtn: 'Delete',
        dialogTitleAdd: 'Add Department',
        dialogTitleEdit: 'Edit Department',
        label: 'Department name',
      },

      positionTable: {
        positionName: 'Positions',
        action: 'Action',
        editBtn: 'Edit',
        deleteBtn: 'Delete',
        dialogTitleAdd: 'Add Position',
        dialogTitleEdit: 'Edit Position',
        jobTitle: 'Job',
        label: 'Position name',
        changeDep: 'Department',
        changePos: 'Position',
      },

      sideMenu: {
        dashboard: 'Dashboard',
        departmentAndPosition: 'Department and Position',
        employeeEdit: 'Edit Employees',
        companySettings: 'Company Settings',
        newTable: 'New Table',
      },
      pieChart: {
        come: 'Come',
        absent: 'Absent',
      },
      
      employeeList: {
        pageTitle: 'Employee List',
        createButton: 'Create',
        uploadButton: 'Upload File',
        downloadQRCodesButton: 'Download QR Codes',
      },

      employeeTable: {
        employeeId: 'ID',
        fullName: 'Full Name',
        department: 'Department',
        position: 'Position',
        phone: 'Phone',
        email: 'Email',
        action: 'Action',
        title: 'Employee List',
        editBtn: 'Edit',
        deleteBtn: 'Delete',
        downloadQRCodeBtn: 'Download QR Code', 
      },

      newTable: {
        page: 'Page',
        of: 'of', 
        back: 'back',
        forward: 'forward',
        continued: '(continued)',
      },

      createEmployeeModal: {
        title: 'Create Employee',
        name: 'Name',
        employeeId: 'Employee ID',
        password: 'Password',
        position: 'Position',
        department: 'Department',
        role: 'Role',
        roleAdmin: 'Admin',
        roleEmployee: 'Employee',
        phoneNumber: 'Phone Number',
        email: 'email Address',
        cancelBtn: 'Cancel',
        saveBtn: 'Save',
      },

      uploadModal: {
        title: 'Upload excel file',
        fileName: 'File Name: ',
        selectedFileBtn: 'Select File',
        uploadBtn: 'Upload',
        cancelBtn: 'Cancel',
      },

      settings: {
        mainTitle: 'Company Settings',
        companyNameLabel:'Company Name',
        logo: 'Logo',
        logoBtn: 'Upload',
        chapter1Title: 'Company Overview',
        chapter2Title: 'Company Location',
        chapter3Title: 'Attendance Rules',
        coordinatesLabel: 'Company Coordinates',
        startLabel: 'Start Time',
        lateLabel: 'Late Time (minutes)',
        endLabel: 'End Time',
        overEndLabel: 'Overtime End Time',
        overTitle: 'Overtime: ',
        overStartTitle: 'Start: ',
        overEndTitle: 'End: ',
        saveBtn: 'Save All',
        selectedFile: 'Selected File: ',
      },

      lineChart: {
        title: 'Attendance Chart',
        selectMonth: 'Select Month and Year',
        interval: {
          first: '1st-10th',
          second: '11th-20th',
          third: '21st-30(31)th',
        },
        monthDialog: {
          year: 'Year',
          month: 'Month',
        },
      },
      
    },
  },

  ja: {
    admin: {
      // Существующие переводы...
      totalEmployee: '総従業員',
      onTime: '時間通り',
      absent: '欠席',
      lateArrival: '遅刻',
      earlyDepartures: '早退',
      earlyCome: '早出',
      employeeId: 'ID',
      fullName: '名前',
      department: '部署',
      position: '役職',
      workDay: '勤務日',
      status: '状態',
      comeTime: '出勤時間',
      leaveTime: '退勤時間',
      totalHours: '総労働時間',
      barLabel: '部署別出勤率',

      departmentTable: {
        departmentName: '部署名',
        action: 'アクション',
        editBtn: '編集',
        deleteBtn: '削除',
        dialogTitleAdd: '部署を追加',
        dialogTitleEdit: '部署の編集',
        label: '部署名',
      },

      newTable: {
        page: 'ページ',
        of: '/',
        back: '戻る',
        forward: '前へ',
        continued: '(続き)',
      },

      positionTable: {
        positionName: '役職名',
        action: 'アクション',
        editBtn: '編集',
        deleteBtn: '削除',
        dialogTitleAdd: '役職を追加',
        dialogTitleEdit: '役職の編集',
        jobTitle: '役職名',
        label: '役職名',
        changeDep: '部署',
        changePos: '役職',
      },

      sideMenu: {
        dashboard: 'ダッシュボード',
        departmentAndPosition: '部署と役職',
        employeeEdit: '従業員の編集',
        companySettings: '会社の設定',
        newTable: '新しいテーブル',
      },

      pieChart: {
        come: '出席',
        absent: '欠席',
      },

      employeeList: {
        pageTitle: '従業員リスト',
        createButton: '作成',
        uploadButton: 'ファイルをアップロード',
        downloadQRCodesButton: 'すべてのQRコード',
      },

      employeeTable: {
        employeeId: 'ID',
        fullName: 'フルネーム',
        department: '部署',
        position: '役職',
        phone: '電話番号',
        email: 'メールアドレス',
        action: 'アクション',
        title: '従業員リスト',
        editBtn: '編集',
        deleteBtn: '削除',
        downloadQRCodeBtn: 'QRコード',
      },

      createEmployeeModal: {
        title: '新入社員の作成',
        name: '氏名',
        employeeId: '従業員 ID',
        password: 'パスワード',
        position: '役職',
        department: '部署',
        role: '役職',
        roleAdmin: '管理者',
        roleEmployee: '従業員',
        phoneNumber: '電話番号',
        email: 'メールアドレス',
        cancelBtn: 'キャンセル',
        saveBtn: '保存',
      },

      uploadModal: {
        title: 'Excelファイルのアップロード',
        fileName: 'ファイルを選択:',
        selectedFileBtn: '選択されたファイル',
        cancelBtn: 'キャンセル',
        uploadBtn: 'アップロード',
      },

      settings: {
        mainTitle: '会社設定',
        companyNameLabel: '会社名',
        logo: 'ロゴ',
        logoBtn: 'アップロード',
        chapter1Title: '会社概要',
        chapter2Title: '会社所在地',
        chapter3Title: '出席ルール',
        coordinatesLabel: '会社の座標',
        startLabel: '開始時間',
        lateLabel: '遅刻時間（分）',
        endLabel: '終了時間',
        overEndLabel: '残業終了時間',
        overTitle: '残業',
        overStartTitle: '開始: ',
        overEndTitle: '終了: ',
        saveBtn: 'すべて保存',
        selectedFile: '選択されたファイル',
      },
      
      

      // Добавьте переводы для компонента графика
      lineChart: {
        title: '出勤状況グラフ',
        selectMonth: '月と年を選択',
        interval: {
          first: '1日-10日',
          second: '11日-20日',
          third: '21日-30(31)日',
        },
        monthDialog: {
          year: '年',
          month: '月',
        },
      },
    },
  },
};


i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        ...commonResources.en,
        ...userResources.en,
        ...adminResources.en, 
      },
      ja: {
        ...commonResources.ja,
        ...userResources.ja,
        ...adminResources.ja, 
      },
    },
    lng: 'ja', // Язык по умолчанию
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    ns: ['common', 'user', 'admin'], // Удалите 'sideMenu' и оставьте только необходимые пространства имен
    defaultNS: 'common',
  });

export default i18n;
