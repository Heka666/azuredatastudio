/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { QueryEditorInput } from 'sql/workbench/common/editor/query/queryEditorInput';
import { QueryResultsInput } from 'sql/workbench/common/editor/query/queryResultsInput';
import { IConnectionManagementService } from 'sql/platform/connection/common/connectionManagement';
import { IQueryModelService } from 'sql/workbench/services/query/common/queryModel';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IResolvedTextEditorModel } from 'vs/editor/common/services/resolverService';
import { UntitledTextEditorInput } from 'vs/workbench/services/untitled/common/untitledTextEditorInput';
import { IUntitledTextEditorModel } from 'vs/workbench/services/untitled/common/untitledTextEditorModel';
import { EncodingMode, IEncodingSupport } from 'vs/workbench/services/textfile/common/textfiles';
import { GroupIdentifier, ISaveOptions, IEditorInput } from 'vs/workbench/common/editor';
import { FileQueryEditorInput } from 'sql/workbench/contrib/query/common/fileQueryEditorInput';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { FileEditorInput } from 'vs/workbench/contrib/files/common/editors/fileEditorInput';

export class UntitledQueryEditorInput extends QueryEditorInput implements IEncodingSupport {

	public static readonly ID = 'workbench.editorInput.untitledQueryInput';

	constructor(
		description: string | undefined,
		text: UntitledTextEditorInput,
		results: QueryResultsInput,
		@IConnectionManagementService connectionManagementService: IConnectionManagementService,
		@IQueryModelService queryModelService: IQueryModelService,
		@IConfigurationService configurationService: IConfigurationService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super(description, text, results, connectionManagementService, queryModelService, configurationService);
	}

	public override resolve(): Promise<IUntitledTextEditorModel & IResolvedTextEditorModel> {
		return this.text.resolve();
	}

	public override get text(): UntitledTextEditorInput {
		return this._text as UntitledTextEditorInput;
	}

	public get hasAssociatedFilePath(): boolean {
		return this.text.model.hasAssociatedFilePath;
	}

	override async save(group: GroupIdentifier, options?: ISaveOptions): Promise<IEditorInput | undefined> {
		let preProcessed = await this.text.saveAs(group, options);
		// TODO: Need to find way of generating new URI for results so that it won't break.

		// let newFileQueryInput = this.instantiationService.createInstance(FileQueryEditorInput, '', (preProcessed as FileEditorInput), this._results);
		// newFileQueryInput.state.resultsVisible = this.state.resultsVisible;
		// this.state.isSaving = true;
		// this.state.oldUri = this.uri;
		// //need to find way to add URIs into input.
		// return newFileQueryInput;
		return preProcessed;
	}

	override async saveAs(group: GroupIdentifier, options?: ISaveOptions): Promise<IEditorInput | undefined> {
		let preProcessed = await this.text.saveAs(group, options);
		// TODO: Need to find way of generating new URI for results so that it won't break.

		// let newFileQueryInput = this.instantiationService.createInstance(FileQueryEditorInput, '', (preProcessed as FileEditorInput), this._results);
		// newFileQueryInput.state.resultsVisible = this.state.resultsVisible;
		// this.state.isSaving = true;
		// this.state.oldUri = this.uri;
		// //need to find way to add URIs into input.
		// return newFileQueryInput;
		return preProcessed;
	}

	public setMode(mode: string): void {
		this.text.setMode(mode);
	}

	public getMode(): string | undefined {
		return this.text.getMode();
	}

	override get typeId(): string {
		return UntitledQueryEditorInput.ID;
	}

	public getEncoding(): string | undefined {
		return this.text.getEncoding();
	}

	public setEncoding(encoding: string, mode: EncodingMode): Promise<void> {
		return this.text.setEncoding(encoding, mode);
	}

	override isUntitled(): boolean {
		// Subclasses need to explicitly opt-in to being untitled.
		return true;
	}
}