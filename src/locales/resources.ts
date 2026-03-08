// src/locales/resources.ts
export const resources = {
  en: {
    translation: {
      common: {
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        search: "Search",
        close: "Close",
        loading: "Loading...",
        actions: "Actions",
        page: "Page",
        previous: "Previous Page",
        next: "Next Page",
        detail: "Detail"
      },
      login: {
        title: "Login",
        username: "Username",
        password: "Password",
        submit: "Login",
        logging_in: "Logging in...",
        failed: "Login failed",
        error_generic: "An error occurred during login. Please try again."
      },
      menu: {
        routes: "Routes",
        locations: "Locations",
        transportations: "Transportations",
        logout: "Logout"
      },
      locations: {
        title: "Locations",
        add_new: "+ Click to add new location",
        name: "Name",
        country: "Country",
        city: "City",
        code: "Code",
        delete_title: "Delete Location",
        delete_confirm: "Are you sure you want to delete this location? This action cannot be undone."
      },
      transportations: {
        title: "Transportations",
        add_new: "+ Click to add new transportation",
        origin: "Origin",
        destination: "Destination",
        type: "Type",
        operating_days: "Operating Days",
        filter_origin: "Filter Origin",
        filter_destination: "Filter Destination",
        filter_type: "Filter Type",
        filter_day: "Filter Day",
        select_origin: "Select Origin",
        select_destination: "Select Destination",
        select_type: "Select Type",
        hold_ctrl: "Hold Ctrl to select multiple",
        delete_title: "Delete Transportation",
        delete_confirm: "Are you sure you want to delete this transportation? This action cannot be undone."
      },
      routes: {
        title: "Routes",
        select_origin: "Select Origin",
        select_destination: "Select Destination",
        choose_date: "Please choose a date",
        searching: "Searching...",
        no_routes: "No routes found.",
        please_search: "Please search for routes."
      },
      errors: {
        access_denied: "Access Denied",
        access_denied_msg: "You do not have permission, please contact your system administrator.",
        validation_error: "Validation Error",
        required_fields: "All fields are required.",
        name_length: "Name is required and cannot exceed 150 characters.",
        country_length: "Country is required and cannot exceed 100 characters.",
        city_length: "City is required and cannot exceed 100 characters.",
        code_length: "Location Code is required and cannot exceed 10 characters.",
        create_failed: "Failed to create record.",
        update_failed: "Failed to update record."
      }
    }
  },
  tr: {
    translation: {
      common: {
        save: "Kaydet",
        cancel: "İptal",
        delete: "Sil",
        edit: "Düzenle",
        search: "Ara",
        close: "Kapat",
        loading: "Yükleniyor...",
        actions: "İşlemler",
        page: "Sayfa",
        previous: "Önceki Sayfa",
        next: "Sonraki Sayfa",
        detail: "Detay"
      },
      login: {
        title: "Giriş Yap",
        username: "Kullanıcı Adı",
        password: "Şifre",
        submit: "Giriş",
        logging_in: "Giriş yapılıyor...",
        failed: "Giriş başarısız",
        error_generic: "Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin."
      },
      menu: {
        routes: "Rotalar",
        locations: "Lokasyonlar",
        transportations: "Ulaşımlar",
        logout: "Çıkış"
      },
      locations: {
        title: "Lokasyonlar",
        add_new: "+ Yeni lokasyon eklemek için tıklayın",
        name: "İsim",
        country: "Ülke",
        city: "Şehir",
        code: "Kod",
        delete_title: "Lokasyonu Sil",
        delete_confirm: "Bu lokasyonu silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
      },
      transportations: {
        title: "Ulaşımlar",
        add_new: "+ Yeni ulaşım eklemek için tıklayın",
        origin: "Kalkış",
        destination: "Varış",
        type: "Tip",
        operating_days: "Sefer Günleri",
        filter_origin: "Kalkış Filtrele",
        filter_destination: "Varış Filtrele",
        filter_type: "Tip Filtrele",
        filter_day: "Gün Filtrele",
        select_origin: "Kalkış Seç",
        select_destination: "Varış Seç",
        select_type: "Tip Seç",
        hold_ctrl: "Çoklu seçim için Ctrl tuşuna basılı tutun",
        delete_title: "Ulaşımı Sil",
        delete_confirm: "Bu ulaşımı silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
      },
      routes: {
        title: "Rotalar",
        select_origin: "Kalkış Seç",
        select_destination: "Varış Seç",
        choose_date: "Lütfen bir tarih seçin",
        searching: "Aranıyor...",
        no_routes: "Rota bulunamadı.",
        please_search: "Lütfen rota arayın."
      },
      errors: {
        access_denied: "Erişim Reddedildi",
        access_denied_msg: "Yetkiniz bulunmamaktadır, lütfen sistem yöneticinizle görüşün.",
        validation_error: "Doğrulama Hatası",
        required_fields: "Tüm alanlar zorunludur.",
        name_length: "İsim zorunludur ve 150 karakteri geçemez.",
        country_length: "Ülke zorunludur ve 100 karakteri geçemez.",
        city_length: "Şehir zorunludur ve 100 karakteri geçemez.",
        code_length: "Lokasyon Kodu zorunludur ve 10 karakteri geçemez.",
        create_failed: "Kayıt oluşturulamadı.",
        update_failed: "Kayıt güncellenemedi."
      }
    }
  }
};
