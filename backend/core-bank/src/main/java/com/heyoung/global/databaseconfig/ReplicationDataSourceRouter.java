package com.heyoung.global.databaseconfig;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;
import org.springframework.transaction.support.TransactionSynchronizationManager;

public class ReplicationDataSourceRouter extends AbstractRoutingDataSource {

	@Override
	protected Object determineCurrentLookupKey() {
		boolean isTransactionActive = TransactionSynchronizationManager.isActualTransactionActive();
		boolean readOnly = TransactionSynchronizationManager.isCurrentTransactionReadOnly();
		return ReplicationType.from(isTransactionActive, readOnly);
	}
}
