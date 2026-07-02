import React from 'react';
import styles from '../admin.module.css';
import { ResumeSettings } from './ResumeSettings';

export default function SettingsPage() {
    return (
        <div>
            <div className={styles.dashboardHeader}>
                <h1 className={styles.dashboardTitle}>Settings</h1>
                <p className={styles.dashboardSubtitle}>
                    Manage public site configuration.
                </p>
            </div>

            <ResumeSettings />
        </div>
    );
}
