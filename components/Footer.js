/**
 * 迦福堂 頁尾元件 (Footer Component)
 */

export function createFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <!-- 堂會簡介 -->
          <div>
            <h4 class="footer-col-title">五旬節聖潔會迦福堂</h4>
            <p style="font-size: 0.9rem; color: rgba(255,255,255,0.7); line-height: 1.8; margin-bottom: 1.5rem;">
              「你們要將當納的十分之一全然送入倉庫，使我家有糧...」(瑪拉基書 3:10)<br>
              扎根觀塘，共建神家。在新堂的恩典旅程中，同心敬拜、彼此服事、傳揚基督。
            </p>
            <p style="font-size: 0.85rem; color: var(--kf-secondary-light); letter-spacing: 0.1em;">
              Together We Build in Faith 踏上信心之旅
            </p>
          </div>

          <!-- 快速連結 -->
          <div>
            <h4 class="footer-col-title">網站導覽</h4>
            <ul class="footer-links">
              <li><a href="index.html">首頁</a></li>
              <li><a href="about.html">關於我們</a></li>
              <li><a href="events.html">活動聚會</a></li>
              <li><a href="news.html">最新消息</a></li>
              <li><a href="prayer.html">代禱事項</a></li>
              <li><a href="giving.html">奉獻支持</a></li>
              <li><a href="contact.html">聯絡我們</a></li>
            </ul>
          </div>

          <!-- 聚會時間 -->
          <div>
            <h4 class="footer-col-title">主日崇拜</h4>
            <ul class="footer-links">
              <li style="color: rgba(255,255,255,0.85); font-size: 0.88rem;">
                <strong>早堂崇拜</strong><br>主日上午 09:30
              </li>
              <li style="color: rgba(255,255,255,0.85); font-size: 0.88rem; margin-top: 0.75rem;">
                <strong>午堂崇拜</strong><br>主日上午 11:30
              </li>
              <li style="color: rgba(255,255,255,0.85); font-size: 0.88rem; margin-top: 0.75rem;">
                <strong>少年崇拜</strong><br>逢週六 下午 05:30 (17:30)
              </li>
            </ul>
          </div>

          <!-- 堂址與聯絡 -->
          <div>
            <h4 class="footer-col-title">聯絡資訊</h4>
            <div class="footer-info-item">
              <span>📍</span>
              <span>香港九龍觀塘成業街86號電訊一代廣場23樓A室 (新堂址)</span>
            </div>
            <div class="footer-info-item">
              <span>✉️</span>
              <span>kafookphc@kfphc.org</span>
            </div>
            <div class="footer-info-item">
              <span>💳</span>
              <span>轉數快 (FPS ID): 164535320</span>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div>
            © 2026 五旬節聖潔會迦福堂有限公司 Ka Fook Pentecostal Holiness Church Ltd. 版權所有.
          </div>
          <div>
            靜謐現代風格 · 堂址面積 3,813 呎
          </div>
        </div>
      </div>
    </footer>
  `;
}

export default createFooter;
