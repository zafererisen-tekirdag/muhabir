export interface SampleDocumentPack {
  id: string;
  title: string;
  period: string;
  description: string;
  documentsText: string;
  suggestedQuestions: string[];
}

export const SAMPLE_DOCUMENT_PACKS: SampleDocumentPack[] = [
  {
    id: 'amasya-1919',
    title: 'Amasya Genelgesi (22 Haziran 1919)',
    period: 'Milli Mücadele Başlangıcı, 1919',
    description: 'Kurtuluş Savaşı’nın amaç, gerekçe ve yöntemini belirleyen tarihi ihtilal beyannamesi.',
    documentsText: `Belge 1:
"Vatanın bütünlüğü, milletin bağımsızlığı tehlikededir. İstanbul Hükûmeti, üzerine aldığı sorumluluğun gereklerini yerine getirememektedir. Bu durum milletimizi yok olmuş gibi göstermektedir." (Amasya Tamimi, 1. ve 2. Madde)

Belge 2:
"Milletin bağımsızlığını, yine milletin azim ve kararı kurtaracaktır. Milletin durumunu göz önünde tutmak ve haklarını dile getirip bütün dünyaya duyurmak için her türlü denetimden uzak millî bir heyetin varlığı zaruridir." (Amasya Tamimi, 3. ve 4. Madde)

Belge 3:
"Anadolu'nun her bakımdan en güvenli yeri olan Sivas'ta millî bir kongrenin acele toplanması kararlaştırılmıştır. Bunun için bütün vilayetlerin her sancağından milletin güvenini kazanmış üçer delegenin hemen yola çıkarılması gerekmektedir." (Amasya Tamimi, 5. Madde)`,
    suggestedQuestions: [
      'Amasya Genelgesi\'nde vatanın ve milletin durumu hakkında ne denmiştir?',
      'İstanbul Hükûmeti\'nin durumu belgede nasıl açıklanmıştır?',
      'Milletin bağımsızlığını neyin kurtaracağı bildirilmiştir?',
      'Sivas\'ta toplanacak kongre için delegelerin nasıl seçilmesi istenmiştir?',
      'Mustafa Kemal Paşa gibi birinci tekil şahısla bana hitap eder misin?',
      'Lozan Barış Antlaşması ne zaman imzalandı?' // Tests the out-of-bounds rule
    ]
  },
  {
    id: 'erzurum-1919',
    title: 'Erzurum Kongresi Kararları (7 Ağustos 1919)',
    period: 'Doğu Anadolu Müdafaa-i Hukuk, 1919',
    description: 'Manda ve himayenin ilk kez reddedildiği, milli sınırların çizildiği kararlar.',
    documentsText: `Belge 1:
"Millî sınırlar içinde vatan bölünmez bir bütündür, parçalanamaz. Her türlü yabancı işgal ve müdahalesine karşı millet, topyekûn kendisini savunacak ve direnecektir." (Erzurum Kongresi Bildirisi, 1. Madde)

Belge 2:
"İstanbul Hükûmeti vatanı koruma ve bağımsızlığı sağlama gücünü gösteremezse, geçici bir hükûmet kurulacaktır. Bu hükûmet üyeleri millî kongrece seçilecektir." (Erzurum Kongresi Bildirisi, 2. Madde)

Belge 3:
"Kuvâ-yı Millîye'yi tek kuvvet tanımak ve millî iradeyi hâkim kılmak esastır. Hristiyan unsurlara siyasî hâkimiyetimizi ve sosyal dengemizi bozacak imtiyazlar verilemez. Manda ve himaye kabul olunamaz." (Erzurum Kongresi Bildirisi, 3. ve 4. Madde)`,
    suggestedQuestions: [
      'Millî sınırlar hakkında belgede ne karar alınmıştır?',
      'Manda ve himaye konusunda hangi ifade yer almaktadır?',
      'Kuvâ-yı Millîye ve millî irade hakkında ne denmektedir?',
      'TBMM kaç yılında açıldı?'
    ]
  },
  {
    id: 'misak-i-milli-1920',
    title: 'Misak-ı Millî Beyannamesi (28 Ocak 1920)',
    period: 'Son Osmanlı Mebusan Meclisi, 1920',
    description: 'Türk milletinin asgari barış şartlarını ve vatan sınırlarını belirleyen tarihi ahitname.',
    documentsText: `Belge 1:
"Osmanlı Devleti'nin yalnızca Arap çoğunluğu bulunan ve 30 Ekim 1918 tarihli ateşkesin imzalanması sırasında düşman ordularının işgali altında kalan yerlerinin kaderi, ahalisinin serbestçe beyan edeceği oylara göre tayin edilmelidir. Ateşkes hattı içinde kalan Türk ve İslam çoğunluğu bulunan kısımların tamamı hiçbir şekilde bölünme kabul etmez bir bütündür." (Madde 1)

Belge 2:
"Halkı ilk serbest kaldıkları zamanda kendi oylarıyla anavatana katılmış olan Kars, Ardahan ve Batum (Elviye-i Selâse) için gerekirse yeniden genel oylamaya başvurulmasını kabul ederiz." (Madde 2)

Belge 3:
"Siyasî, adlî ve malî gelişmemize engel olan sınırlamalar (kapitülasyonlar) kesinlikle kaldırılmalıdır. Belirlenecek borçlarımızın ödenmesi şartları da bu esasa aykırı olmayacaktır." (Madde 6)`,
    suggestedQuestions: [
      'Kapitülasyonlar hakkında belgede ne söylenmektedir?',
      'Kars, Ardahan ve Batum için ne öngörülmüştür?',
      'Ateşkes hattı içindeki topraklar hakkında birinci belgede ne denmektedir?'
    ]
  }
];
